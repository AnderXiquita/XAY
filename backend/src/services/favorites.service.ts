import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'

const productInclude = {
  images: { orderBy: { position: 'asc' } },
  category: { select: { id: true, name: true, slug: true } },
  municipality: { select: { id: true, name: true, slug: true } },
  department: { select: { id: true, name: true, slug: true } },
} as const

const visible = { is_active: true, product: { status: { not: 'draft' } } } as const

export async function listFavoriteIds(userId: string) {
  const rows = await prisma.favorite.findMany({
    where: { user_id: userId, ...visible },
    orderBy: { updated_at: 'desc' },
    select: { product_id: true },
  })
  return rows.map((row) => row.product_id)
}

export async function listFavorites(userId: string) {
  const rows = await prisma.favorite.findMany({
    where: { user_id: userId, ...visible },
    orderBy: { updated_at: 'desc' },
    select: { product: { include: productInclude } },
  })
  return rows.map((row) => row.product)
}

export async function addFavorite(userId: string, productId: string) {
  const product = await prisma.product.findFirst({ where: { id: productId, status: { not: 'draft' } }, select: { id: true } })
  if (!product) throw new AppError('Producto no encontrado', 404, 'NOT_FOUND')

  await prisma.favorite.upsert({
    where: { user_id_product_id: { user_id: userId, product_id: productId } },
    create: { user_id: userId, product_id: productId },
    update: { is_active: true },
  })
}

export async function removeFavorite(userId: string, productId: string) {
  await prisma.favorite.updateMany({
    where: { user_id: userId, product_id: productId },
    data: { is_active: false },
  })
}

// los favoritos que el invitado guardó en su navegador pasan a su cuenta al iniciar sesión
export async function mergeFavorites(userId: string, productIds: string[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: { not: 'draft' } },
    select: { id: true },
  })
  const ids = products.map((p) => p.id)
  if (ids.length === 0) return listFavoriteIds(userId)

  await prisma.$transaction([
    prisma.favorite.createMany({ data: ids.map((product_id) => ({ user_id: userId, product_id })), skipDuplicates: true }),
    prisma.favorite.updateMany({ where: { user_id: userId, product_id: { in: ids } }, data: { is_active: true } }),
  ])
  return listFavoriteIds(userId)
}
