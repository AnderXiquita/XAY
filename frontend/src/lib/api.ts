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
  quantity: number      // stock; solo cuenta para complementos modernos
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
  ids?: string
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
  birth_date: string | null
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

// ============================================
// MI CUENTA (requieren token)
// ============================================

export interface Address {
  id: string
  label: string
  recipient_name: string
  phone: string
  zone: string | null
  address_line: string
  reference: string | null
  is_default: boolean
  department: { id: number; name: string }
  municipality: { id: number; name: string }
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: ApiError }

async function authed<T>(token: string, path: string, init: { method?: string; body?: unknown } = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.body !== undefined && { 'Content-Type': 'application/json' }),
      },
      ...(init.body !== undefined && { body: JSON.stringify(init.body) }),
      cache: 'no-store',
    })
    if (res.status === 204) return { ok: true, data: undefined as T }
    const json = await res.json()
    if (!res.ok) return { ok: false, status: res.status, error: json as ApiError }
    return { ok: true, data: (json as { data: T }).data }
  } catch {
    return { ok: false, status: 0, error: { error: 'No pudimos conectar con el servidor. Inténtalo de nuevo.', code: 'NETWORK_ERROR' } }
  }
}

export interface ProfileInput {
  name: string
  phone: string
  birth_date: string
}

export interface AddressFormInput {
  label: string
  recipient_name: string
  phone: string
  department_id: string
  municipality_id: string
  zone: string
  address_line: string
  reference: string
  is_default?: boolean
}

export const updateProfileRequest = (token: string, body: ProfileInput) =>
  authed<User>(token, '/users/me', { method: 'PATCH', body })

export const changePasswordRequest = (token: string, body: { current_password: string; new_password: string }) =>
  authed<void>(token, '/users/me/password', { method: 'PATCH', body })

export const getAddresses = (token: string) => authed<Address[]>(token, '/users/me/addresses')

export const createAddressRequest = (token: string, body: AddressFormInput) =>
  authed<Address>(token, '/users/me/addresses', { method: 'POST', body })

export const updateAddressRequest = (token: string, id: string, body: AddressFormInput) =>
  authed<Address>(token, `/users/me/addresses/${encodeURIComponent(id)}`, { method: 'PATCH', body })

export const setDefaultAddressRequest = (token: string, id: string) =>
  authed<void>(token, `/users/me/addresses/${encodeURIComponent(id)}/default`, { method: 'POST' })

export const deleteAddressRequest = (token: string, id: string) =>
  authed<void>(token, `/users/me/addresses/${encodeURIComponent(id)}`, { method: 'DELETE' })

// ============================================
// FAVORITOS (con sesión; los invitados los guardan en el navegador)
// ============================================

export const getFavoriteIds = (token: string) => authed<string[]>(token, '/favorites/ids')

export const addFavoriteRequest = (token: string, productId: string) =>
  authed<void>(token, `/favorites/${encodeURIComponent(productId)}`, { method: 'PUT' })

export const removeFavoriteRequest = (token: string, productId: string) =>
  authed<void>(token, `/favorites/${encodeURIComponent(productId)}`, { method: 'DELETE' })

export const mergeFavoritesRequest = (token: string, productIds: string[]) =>
  authed<string[]>(token, '/favorites/merge', { method: 'POST', body: { product_ids: productIds } })

// ============================================
// CARRITO (con sesión usa el token; como invitado, el id de carrito de la cookie)
// ============================================

export interface CartLine {
  product_id: string
  quantity: number
  max_quantity: number
  issue: 'sold' | 'unavailable' | 'out_of_stock' | null
  product: Product
}

export interface Cart {
  items: CartLine[]
  count: number
  subtotal: string
}

export const EMPTY_CART: Cart = { items: [], count: 0, subtotal: '0.00' }

export interface CartAuth {
  token?: string | null | undefined
  session?: string | null | undefined
}

async function cartRequest(auth: CartAuth, path: string, init: { method?: string; body?: unknown } = {}): Promise<ApiResult<Cart>> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cart${path}`, {
      method: init.method ?? 'GET',
      headers: {
        ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
        ...(auth.session && { 'X-Cart-Session': auth.session }),
        ...(init.body !== undefined && { 'Content-Type': 'application/json' }),
      },
      ...(init.body !== undefined && { body: JSON.stringify(init.body) }),
      cache: 'no-store',
    })
    const json = await res.json()
    if (!res.ok) return { ok: false, status: res.status, error: json as ApiError }
    return { ok: true, data: (json as { data: Cart }).data }
  } catch {
    return { ok: false, status: 0, error: { error: 'No pudimos conectar con el servidor. Inténtalo de nuevo.', code: 'NETWORK_ERROR' } }
  }
}

export const getCartRequest = (auth: CartAuth) => cartRequest(auth, '')

export const addCartItemRequest = (auth: CartAuth, productId: string, quantity = 1) =>
  cartRequest(auth, '/items', { method: 'POST', body: { product_id: productId, quantity } })

export const updateCartItemRequest = (auth: CartAuth, productId: string, quantity: number) =>
  cartRequest(auth, `/items/${encodeURIComponent(productId)}`, { method: 'PATCH', body: { quantity } })

export const removeCartItemRequest = (auth: CartAuth, productId: string) =>
  cartRequest(auth, `/items/${encodeURIComponent(productId)}`, { method: 'DELETE' })

export const mergeCartRequest = (token: string, session: string) => cartRequest({ token, session }, '/merge', { method: 'POST' })
