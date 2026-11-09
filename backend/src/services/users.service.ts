import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'
import { publicUserSelect, SALT_ROUNDS } from './auth.service.js'
import type { AddressInput, ChangePasswordInput, UpdateProfileInput } from '../schemas/users.schema.js'

const MAX_ADDRESSES = 10

const addressSelect = {
  id: true,
  label: true,
  recipient_name: true,
  phone: true,
  zone: true,
  address_line: true,
  reference: true,
  is_default: true,
  department: { select: { id: true, name: true } },
  municipality: { select: { id: true, name: true } },
} as const

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      phone: input.phone ?? null,
      birth_date: input.birth_date ?? null,
    },
    select: publicUserSelect,
  })
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { password_hash: true } })
  if (!user?.password_hash) {
    throw new AppError('Tu cuenta no usa contraseña', 400, 'NO_PASSWORD')
  }

  if (!(await bcrypt.compare(input.current_password, user.password_hash))) {
    throw new AppError('La contraseña actual no es correcta', 400, 'VALIDATION_ERROR', {
      current_password: ['La contraseña actual no es correcta'],
    })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: await bcrypt.hash(input.new_password, SALT_ROUNDS) },
  })
}

export function listAddresses(userId: string) {
  return prisma.address.findMany({
    where: { user_id: userId, is_active: true },
    orderBy: [{ is_default: 'desc' }, { created_at: 'asc' }],
    select: addressSelect,
  })
}

async function assertMunicipalityInDepartment(departmentId: number, municipalityId: number) {
  const municipality = await prisma.municipality.findUnique({ where: { id: municipalityId }, select: { department_id: true } })
  if (!municipality || municipality.department_id !== departmentId) {
    throw new AppError('Revisa los datos del formulario', 400, 'VALIDATION_ERROR', {
      municipality_id: ['Elige un municipio del departamento'],
    })
  }
}

async function findOwnAddress(userId: string, addressId: string) {
  const address = await prisma.address.findFirst({ where: { id: addressId, user_id: userId, is_active: true }, select: { id: true, is_default: true } })
  if (!address) throw new AppError('Dirección no encontrada', 404, 'NOT_FOUND')
  return address
}

function addressData(input: AddressInput) {
  return {
    label: input.label,
    recipient_name: input.recipient_name,
    phone: input.phone,
    department_id: input.department_id,
    municipality_id: input.municipality_id,
    zone: input.zone ?? null,
    address_line: input.address_line,
    reference: input.reference ?? null,
  }
}

export async function createAddress(userId: string, input: AddressInput) {
  await assertMunicipalityInDepartment(input.department_id, input.municipality_id)

  const count = await prisma.address.count({ where: { user_id: userId, is_active: true } })
  if (count >= MAX_ADDRESSES) {
    throw new AppError(`Puedes guardar hasta ${MAX_ADDRESSES} direcciones`, 400, 'ADDRESS_LIMIT')
  }

  // la primera dirección siempre queda como principal
  const isDefault = count === 0 || input.is_default === true

  return prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({ where: { user_id: userId, is_default: true }, data: { is_default: false } })
    }
    return tx.address.create({
      data: { ...addressData(input), user_id: userId, is_default: isDefault },
      select: addressSelect,
    })
  })
}

export async function updateAddress(userId: string, addressId: string, input: AddressInput) {
  const current = await findOwnAddress(userId, addressId)
  await assertMunicipalityInDepartment(input.department_id, input.municipality_id)

  const makeDefault = input.is_default === true && !current.is_default

  return prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.address.updateMany({ where: { user_id: userId, is_default: true }, data: { is_default: false } })
    }
    return tx.address.update({
      where: { id: addressId },
      data: { ...addressData(input), ...(makeDefault && { is_default: true }) },
      select: addressSelect,
    })
  })
}

export async function setDefaultAddress(userId: string, addressId: string) {
  await findOwnAddress(userId, addressId)
  await prisma.$transaction([
    prisma.address.updateMany({ where: { user_id: userId, is_default: true }, data: { is_default: false } }),
    prisma.address.update({ where: { id: addressId }, data: { is_default: true } }),
  ])
}

// no se borra: los pedidos guardan su propia copia, pero mantenemos el registro
export async function deleteAddress(userId: string, addressId: string) {
  const current = await findOwnAddress(userId, addressId)

  await prisma.$transaction(async (tx) => {
    await tx.address.update({ where: { id: addressId }, data: { is_active: false, is_default: false } })

    if (current.is_default) {
      const next = await tx.address.findFirst({
        where: { user_id: userId, is_active: true },
        orderBy: { created_at: 'asc' },
        select: { id: true },
      })
      if (next) await tx.address.update({ where: { id: next.id }, data: { is_default: true } })
    }
  })
}
