import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'
import type { Prisma } from '../generated/prisma/client.js'

const userSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  is_active: true,
  created_at: true,
  _count: { select: { addresses: { where: { is_active: true } }, orders: true, favorites: { where: { is_active: true } } } },
} as const

export async function listUsers(query: { search?: string; page?: string; limit?: string }) {
  const page = Math.max(1, Number.parseInt(query.page ?? '1') || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit ?? '20') || 20))
  const where: Prisma.UserWhereInput = {}
  if (query.search?.trim()) {
    const term = query.search.trim()
    where.OR = [{ name: { contains: term, mode: 'insensitive' } }, { email: { contains: term, mode: 'insensitive' } }]
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, orderBy: { created_at: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.user.count({ where }),
  ])
  return { data, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }
}

// desactivar no borra la cuenta: solo impide iniciar sesión
export async function setUserActive(adminId: string, userId: string, isActive: boolean) {
  if (adminId === userId && !isActive) throw new AppError('No puedes desactivar tu propia cuenta', 400, 'SELF_DEACTIVATION')
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!user) throw new AppError('Usuario no encontrado', 404, 'NOT_FOUND')
  return prisma.user.update({ where: { id: userId }, data: { is_active: isActive }, select: userSelect })
}
