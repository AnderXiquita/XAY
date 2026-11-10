import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'
import { Prisma } from '../generated/prisma/client.js'

export type CartOwner = { user_id: string } | { session_id: string }

type CartIssue = 'sold' | 'unavailable' | 'out_of_stock'

const productInclude = {
  images: { orderBy: { position: 'asc' } },
  category: { select: { id: true, name: true, slug: true } },
  municipality: { select: { id: true, name: true, slug: true } },
  department: { select: { id: true, name: true, slug: true } },
} as const

interface StockInfo {
  status: string
  is_traditional: boolean
  quantity: number
}

// las prendas típicas son únicas (máx. 1); los complementos modernos dependen de su stock
function maxQuantity(product: StockInfo) {
  return product.is_traditional ? 1 : Math.max(0, product.quantity)
}

function issueOf(product: StockInfo): CartIssue | null {
  if (product.status === 'sold') return 'sold'
  if (product.status !== 'available') return 'unavailable'
  if (maxQuantity(product) < 1) return 'out_of_stock'
  return null
}

const ISSUE_MESSAGES: Record<CartIssue, string> = {
  sold: 'Esta pieza ya se vendió',
  unavailable: 'Esta pieza no está disponible',
  out_of_stock: 'Ya no hay unidades disponibles',
}

function uniqueWhere(owner: CartOwner, productId: string) {
  return 'user_id' in owner
    ? { user_id_product_id: { user_id: owner.user_id, product_id: productId } }
    : { session_id_product_id: { session_id: owner.session_id, product_id: productId } }
}

export async function getCart(owner: CartOwner) {
  const rows = await prisma.cartItem.findMany({
    where: owner,
    orderBy: { created_at: 'asc' },
    include: { product: { include: productInclude } },
  })

  let subtotal = new Prisma.Decimal(0)
  let count = 0

  const items = rows.map((row) => {
    const issue = issueOf(row.product)
    const max = maxQuantity(row.product)
    const quantity = Math.min(row.quantity, Math.max(max, 1))
    if (!issue) {
      subtotal = subtotal.add(row.product.price.mul(quantity))
      count += quantity
    }
    return { product_id: row.product_id, quantity, max_quantity: max, issue, product: row.product }
  })

  return { items, count, subtotal: subtotal.toFixed(2) }
}

export async function addItem(owner: CartOwner, productId: string, quantity = 1) {
  const product = await prisma.product.findFirst({
    where: { id: productId, status: { not: 'draft' } },
    select: { id: true, status: true, is_traditional: true, quantity: true },
  })
  if (!product) throw new AppError('Producto no encontrado', 404, 'NOT_FOUND')

  const issue = issueOf(product)
  if (issue) throw new AppError(ISSUE_MESSAGES[issue], 409, 'PRODUCT_UNAVAILABLE')

  const max = maxQuantity(product)
  const existing = await prisma.cartItem.findUnique({ where: uniqueWhere(owner, productId), select: { quantity: true } })
  const next = Math.min((existing?.quantity ?? 0) + quantity, max)

  await prisma.cartItem.upsert({
    where: uniqueWhere(owner, productId),
    create: { ...owner, product_id: productId, quantity: next },
    update: { quantity: next },
  })

  return getCart(owner)
}

export async function updateItem(owner: CartOwner, productId: string, quantity: number) {
  const line = await prisma.cartItem.findUnique({
    where: uniqueWhere(owner, productId),
    select: { product: { select: { status: true, is_traditional: true, quantity: true } } },
  })
  if (!line) throw new AppError('Esta pieza no está en tu carrito', 404, 'NOT_FOUND')

  await prisma.cartItem.update({
    where: uniqueWhere(owner, productId),
    data: { quantity: Math.max(1, Math.min(quantity, maxQuantity(line.product))) },
  })

  return getCart(owner)
}

export async function removeItem(owner: CartOwner, productId: string) {
  await prisma.cartItem.deleteMany({ where: { ...owner, product_id: productId } })
  return getCart(owner)
}

// al iniciar sesión, lo que agregó como invitado pasa a su cuenta
export async function mergeGuestCart(userId: string, sessionId: string) {
  const guestItems = await prisma.cartItem.findMany({
    where: { session_id: sessionId },
    include: { product: { select: { status: true, is_traditional: true, quantity: true } } },
  })

  if (guestItems.length > 0) {
    const userOwner = { user_id: userId }
    await prisma.$transaction(async (tx) => {
      for (const item of guestItems) {
        const where = uniqueWhere(userOwner, item.product_id)
        const existing = await tx.cartItem.findUnique({ where, select: { quantity: true } })
        const quantity = Math.max(1, Math.min((existing?.quantity ?? 0) + item.quantity, Math.max(maxQuantity(item.product), 1)))
        await tx.cartItem.upsert({
          where,
          create: { user_id: userId, product_id: item.product_id, quantity },
          update: { quantity },
        })
      }
      await tx.cartItem.deleteMany({ where: { session_id: sessionId } })
    })
  }

  return getCart({ user_id: userId })
}
