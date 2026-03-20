import { prisma } from '../lib/prisma.js'
import { AppError } from '../lib/AppError.js'

interface ProductFilters {
  category?: string    // slug de la categoría
  department?: string  // slug del departamento
  municipality?: string // slug del municipio
  status?: string
  is_traditional?: string
  min_price?: string
  max_price?: string
  is_featured?: string
  search?: string
  sort?: string        // 'newest' | 'price_asc' | 'price_desc' | 'featured'
  page?: string
  limit?: string
}

export async function getProducts(filters: ProductFilters) {
  const page = Math.max(1, parseInt(filters.page || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit || '12')))
  const skip = (page - 1) * limit

  // Construir filtros dinámicamente
  const where: Record<string, unknown> = {
    // No mostrar borradores en la tienda pública
    status: { not: 'draft' },
  }

  if (filters.category) {
    where.category = { slug: filters.category }
  }

  if (filters.department) {
    where.department = { slug: filters.department }
  }

  if (filters.municipality) {
    where.municipality = { slug: filters.municipality }
  }

  if (filters.status && filters.status !== 'draft') {
    where.status = filters.status
  }

  if (filters.is_traditional !== undefined) {
    where.is_traditional = filters.is_traditional === 'true'
  }

  if (filters.min_price || filters.max_price) {
    where.price = {}
    if (filters.min_price) {
      (where.price as Record<string, unknown>).gte = parseFloat(filters.min_price)
    }
    if (filters.max_price) {
      (where.price as Record<string, unknown>).lte = parseFloat(filters.max_price)
    }
  }

  if (filters.is_featured === 'true') {
    where.is_featured = true
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  // Ordenamiento
  let orderBy: Record<string, string> = { created_at: 'desc' }
  switch (filters.sort) {
    case 'price_asc':
      orderBy = { price: 'asc' }
      break
    case 'price_desc':
      orderBy = { price: 'desc' }
      break
    case 'featured':
      orderBy = { is_featured: 'desc' }
      break
    case 'newest':
    default:
      orderBy = { created_at: 'desc' }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        municipality: { select: { id: true, name: true, slug: true } },
        department: { select: { id: true, name: true, slug: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: 'asc' } },
      category: { select: { id: true, name: true, slug: true } },
      municipality: {
        select: {
          id: true,
          name: true,
          slug: true,
          department: { select: { id: true, name: true, slug: true } },
        },
      },
      department: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!product) {
    throw new AppError('Producto no encontrado', 404, 'PRODUCT_NOT_FOUND')
  }

  // No mostrar borradores en la tienda pública
  if (product.status === 'draft') {
    throw new AppError('Producto no encontrado', 404, 'PRODUCT_NOT_FOUND')
  }

  return product
}
