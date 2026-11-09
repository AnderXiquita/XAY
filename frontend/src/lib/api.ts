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

// ============================================
// CUENTAS
// ============================================

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: 'customer' | 'admin' | 'vendor'
  created_at: string
}

export interface ApiError {
  error: string
  code: string
  details?: Record<string, string[]>
}

export type AuthResult =
  | { ok: true; token: string; user: User }
  | { ok: false; error: ApiError }

async function postAuth(path: string, body: Record<string, string>): Promise<AuthResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    const json = await res.json()
    if (!res.ok) return { ok: false, error: json as ApiError }
    const { token, user } = (json as { data: { token: string; user: User } }).data
    return { ok: true, token, user }
  } catch {
    return { ok: false, error: { error: 'No pudimos conectar con el servidor. Inténtalo de nuevo.', code: 'NETWORK_ERROR' } }
  }
}

export function loginRequest(input: { email: string; password: string }) {
  return postAuth('/login', input)
}

export function registerRequest(input: { name: string; email: string; password: string }) {
  return postAuth('/register', input)
}

export async function getMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return ((await res.json()) as { data: User }).data
  } catch {
    return null
  }
}
