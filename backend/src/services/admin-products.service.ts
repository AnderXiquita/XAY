import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'
import { slugify } from '../lib/slug.js'
import type { Prisma } from '../generated/prisma/client.js'
import type { ProductInput } from '../schemas/admin.schema.js'

// la sección de destacados del home es una cuadrícula de 4 (2 en mobile)
export const MAX_FEATURED = 4

const STATUSES = ['draft', 'available', 'sold', 'coming_soon'] as const
type Status = (typeof STATUSES)[number]

const listInclude = {
  images: { where: { media_type: 'image' }, orderBy: { position: 'asc' }, take: 1 },
  category: { select: { id: true, name: true } },
  municipality: { select: { id: true, name: true } },
  department: { select: { id: true, name: true } },
} as const

const detailInclude = {
  images: { orderBy: { position: 'asc' } },
  category: { select: { id: true, name: true, slug: true } },
  municipality: { select: { id: true, name: true, slug: true } },
  department: { select: { id: true, name: true, slug: true } },
  supplier: { select: { id: true, name: true } },
} as const

interface ListQuery {
  search?: string
  status?: string
  category?: string
  page?: string
  limit?: string
}

export async function listProducts(query: ListQuery) {
  const page = Math.max(1, Number.parseInt(query.page ?? '1') || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit ?? '20') || 20))
  const where: Prisma.ProductWhereInput = {}

  if (query.status && (STATUSES as readonly string[]).includes(query.status)) where.status = query.status as Status
  if (query.category) where.category_id = Number.parseInt(query.category) || -1
  if (query.search?.trim()) {
    const term = query.search.trim()
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { slug: { contains: term, mode: 'insensitive' } },
      { municipality: { name: { contains: term, mode: 'insensitive' } } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, include: listInclude, orderBy: { updated_at: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ])

  return { data, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: detailInclude })
  if (!product) throw new AppError('Producto no encontrado', 404, 'NOT_FOUND')
  return product
}

async function uniqueSlug(base: string, excludeId?: string) {
  const root = slugify(base) || 'producto'
  let candidate = root
  for (let n = 2; ; n++) {
    const taken = await prisma.product.findFirst({ where: { slug: candidate, ...(excludeId && { id: { not: excludeId } }) }, select: { id: true } })
    if (!taken) return candidate
    candidate = `${root}-${n}`
  }
}

function fieldError(field: string, message: string): never {
  throw new AppError('Revisa los datos del producto', 400, 'VALIDATION_ERROR', { [field]: [message] })
}

// arma los datos validando las reglas del catálogo (origen, stock, fotos para publicar)
async function buildData(input: ProductInput, imageCount: number, wasFeatured = false) {
  const category = await prisma.category.findUnique({ where: { id: input.category_id }, select: { id: true } })
  if (!category) fieldError('category_id', 'Elige una categoría válida')

  let departmentId: number | null = null
  if (input.municipality_id) {
    const municipality = await prisma.municipality.findUnique({ where: { id: input.municipality_id }, select: { department_id: true } })
    if (!municipality) fieldError('municipality_id', 'Elige un municipio válido')
    departmentId = municipality.department_id
  }

  if (input.supplier_id) {
    const supplier = await prisma.supplier.findUnique({ where: { id: input.supplier_id }, select: { id: true } })
    if (!supplier) fieldError('supplier_id', 'Elige un proveedor válido')
  }

  // las prendas típicas tienen origen; un borrador puede guardarse incompleto
  if (input.status !== 'draft' && input.is_traditional && !input.municipality_id) {
    fieldError('municipality_id', 'Las prendas típicas necesitan su municipio de origen')
  }
  // solo se revisa al destacar una pieza nueva: guardar una que ya estaba destacada no debe fallar
  if (input.is_featured && !wasFeatured) {
    const featured = await prisma.product.count({ where: { is_featured: true } })
    if (featured >= MAX_FEATURED) {
      fieldError('is_featured', `Ya hay ${MAX_FEATURED} piezas destacadas. Quita una antes de destacar otra.`)
    }
  }

  if (input.status !== 'draft' && imageCount === 0) {
    fieldError('status', 'Agrega al menos una foto antes de publicar. Guárdalo como borrador por ahora.')
  }

  return {
    name: input.name,
    description: input.description ?? null,
    price: input.price,
    category_id: input.category_id,
    municipality_id: input.municipality_id ?? null,
    department_id: departmentId,
    supplier_id: input.is_traditional ? null : (input.supplier_id ?? null),
    is_traditional: input.is_traditional,
    status: input.status,
    width_cm: input.width_cm ?? null,
    length_cm: input.length_cm ?? null,
    size_label: input.size_label ?? null,
    size_notes: input.size_notes ?? null,
    fabric_type: input.fabric_type ?? null,
    embroidery_type: input.embroidery_type ?? null,
    colors: input.colors.map((c) => c.toLowerCase()),
    is_featured: input.is_featured,
    allow_similar_request: input.allow_similar_request,
    // cada prenda típica es única
    quantity: input.is_traditional ? 1 : input.quantity,
  }
}

export async function createProduct(input: ProductInput) {
  const data = await buildData(input, 0)
  const slug = await uniqueSlug(input.slug ?? input.name)
  const product = await prisma.product.create({ data: { ...data, slug }, include: detailInclude })
  return product
}

export async function updateProduct(id: string, input: ProductInput) {
  const current = await prisma.product.findUnique({ where: { id }, select: { id: true, slug: true, is_featured: true, _count: { select: { images: true } } } })
  if (!current) throw new AppError('Producto no encontrado', 404, 'NOT_FOUND')

  const data = await buildData(input, current._count.images, current.is_featured)
  const slug = input.slug && slugify(input.slug) !== current.slug ? await uniqueSlug(input.slug, id) : current.slug
  return prisma.product.update({ where: { id }, data: { ...data, slug }, include: detailInclude })
}

export async function getStats() {
  const [byStatus, featured, users, categories] = await Promise.all([
    prisma.product.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.product.count({ where: { is_featured: true } }),
    prisma.user.count({ where: { is_active: true } }),
    prisma.category.count({ where: { is_active: true } }),
  ])
  const products = Object.fromEntries(STATUSES.map((s) => [s, byStatus.find((row) => row.status === s)?._count._all ?? 0]))
  return { products, featured, maxFeatured: MAX_FEATURED, users, categories }
}
