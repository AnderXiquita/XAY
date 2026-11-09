import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'
import { signToken } from '../lib/jwt.js'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js'

export const SALT_ROUNDS = 12

// para que un correo inexistente tarde lo mismo que una contraseña incorrecta
const DUMMY_HASH = bcrypt.hashSync('dummy-password-xay', SALT_ROUNDS)

export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  birth_date: true,
  role: true,
  created_at: true,
} as const

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } })
  if (existing) {
    throw new AppError('Ya existe una cuenta con este correo', 409, 'EMAIL_IN_USE', { email: ['Ya existe una cuenta con este correo'] })
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password_hash: await bcrypt.hash(input.password, SALT_ROUNDS),
      auth_provider: 'local',
    },
    select: publicUserSelect,
  })

  return { token: signToken({ userId: user.id, role: user.role }), user }
}

export async function login(input: LoginInput) {
  const found = await prisma.user.findUnique({
    where: { email: input.email },
    select: { ...publicUserSelect, password_hash: true, is_active: true },
  })

  const passwordOk = await bcrypt.compare(input.password, found?.password_hash ?? DUMMY_HASH)

  if (!found || !found.password_hash || !found.is_active || !passwordOk) {
    throw new AppError('Correo o contraseña incorrectos', 401, 'INVALID_CREDENTIALS')
  }

  const { password_hash: _hash, is_active: _active, ...user } = found
  return { token: signToken({ userId: user.id, role: user.role }), user }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, is_active: true },
    select: publicUserSelect,
  })

  if (!user) {
    throw new AppError('Tu sesión ya no es válida', 401, 'INVALID_TOKEN')
  }

  return user
}
