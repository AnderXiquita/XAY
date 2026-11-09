/* ============================================
   Cliente HTTP tipado para comunicarse con el backend Express.
   Todas las llamadas a la API pasan por aquí — nunca fetch() sueltos en los componentes.
   La URL base viene de la variable de entorno NEXT_PUBLIC_API_URL.
   ============================================ */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// ============================================
// TIPOS — Espejo de los modelos del backend
// ============================================

export interface ProductImage {
  id: string
  url: string
  alt_text: string | null
  position: number
  type: 'main' | 'flat' | 'detail' | 'model'
  media_type: 'image' | 'video'
  poster_url: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface Department {
  id: number
  name: string
  slug: string
}

export interface Municipality {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: string          // Prisma devuelve Decimal como string en JSON
  status: 'draft' | 'available' | 'sold' | 'coming_soon'
  is_traditional: boolean
  is_featured: boolean
  allow_similar_request: boolean
  width_cm: string | null
  length_cm: string | null
  size_label: string | null
  size_notes: string | null
  fabric_type: string | null
  embroidery_type: 'hand' | 'machine' | 'mixed' | null
  colors: string[]
  category: { id: number; name: string; slug: string }
  municipality: Municipality | null
  department: Department | null
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface ProductsResponse {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// FILTROS — Coinciden con los query params del backend
// ============================================

export interface ProductFilters {
  category?: string
  department?: string
  municipality?: string
  status?: string
  is_traditional?: string
  min_price?: string
  max_price?: string
  is_featured?: string
  search?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured'
  page?: number
  limit?: number
}

// ============================================
// FUNCIONES DE FETCH
// ============================================

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  })

  const res = await fetch(`${BASE_URL}/api/v1/products?${params.toString()}`, {
    next: { revalidate: 60 }, // cachear 60s en producción, ignorado en dev
  })

  if (!res.ok) {
    throw new Error(`Error al obtener productos: ${res.status}`)
  }

  return res.json()
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/api/v1/products/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  })

  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`Error al obtener el producto: ${res.status}`)
  }

  const body: { data: Product } = await res.json()
  return body.data
}

export interface RelatedProducts {
  data: Product[]
  basis: 'department' | 'similar'
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<RelatedProducts> {
  const res = await fetch(
    `${BASE_URL}/api/v1/products/${encodeURIComponent(slug)}/related?limit=${limit}`,
    { next: { revalidate: 60 } },
  )

  if (!res.ok) return { data: [], basis: 'similar' }

  return res.json()
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/api/v1/categories`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error('Error al obtener categorías')
  }

  const json = await res.json()
  return json.data
}

export async function getMunicipalitiesByDepartment(departmentSlug: string): Promise<Municipality[]> {
  const res = await fetch(`${BASE_URL}/api/v1/departments/${departmentSlug}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error('Error al obtener municipios')
  const json = await res.json()
  return json.data.municipalities
}

export async function getDepartments(): Promise<Department[]> {
  const res = await fetch(`${BASE_URL}/api/v1/departments`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error('Error al obtener departamentos')
  }

  const json = await res.json()
  return json.data
}
