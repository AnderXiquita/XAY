import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'
import { slugify } from '../lib/slug.js'
import type { CategoryInput, SupplierInput } from '../schemas/admin.schema.js'

export function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, description: true, is_active: true, _count: { select: { products: true } } },
  })
}

async function assertCategoryNameFree(name: string, excludeId?: number) {
  const taken = await prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, ...(excludeId && { id: { not: excludeId } }) },
    select: { id: true },
  })
  if (taken) throw new AppError('Ya existe esa categoría', 409, 'VALIDATION_ERROR', { name: ['Ya existe una categoría con ese nombre'] })
}

export async function createCategory(input: CategoryInput) {
  await assertCategoryNameFree(input.name)
  return prisma.category.create({
    data: { name: input.name, slug: slugify(input.name), description: input.description ?? null, is_active: input.is_active },
  })
}

// el slug no cambia al renombrar: así no se rompen los links que ya existen (/tienda?category=...)
export async function updateCategory(id: number, input: CategoryInput) {
  const current = await prisma.category.findUnique({ where: { id }, select: { id: true } })
  if (!current) throw new AppError('Categoría no encontrada', 404, 'NOT_FOUND')
  await assertCategoryNameFree(input.name, id)
  return prisma.category.update({
    where: { id },
    data: { name: input.name, description: input.description ?? null, is_active: input.is_active },
  })
}

export function listSuppliers() {
  return prisma.supplier.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, contact_name: true, email: true, phone: true, notes: true, is_active: true, _count: { select: { products: true } } },
  })
}

function supplierData(input: SupplierInput) {
  return {
    name: input.name,
    contact_name: input.contact_name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    notes: input.notes ?? null,
    is_active: input.is_active,
  }
}

export function createSupplier(input: SupplierInput) {
  return prisma.supplier.create({ data: supplierData(input) })
}

export async function updateSupplier(id: number, input: SupplierInput) {
  const current = await prisma.supplier.findUnique({ where: { id }, select: { id: true } })
  if (!current) throw new AppError('Proveedor no encontrado', 404, 'NOT_FOUND')
  return prisma.supplier.update({ where: { id }, data: supplierData(input) })
}
