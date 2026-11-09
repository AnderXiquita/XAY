'use server'

import { addFavoriteRequest, getFavoriteIds, getProducts, mergeFavoritesRequest, removeFavoriteRequest, type Product } from '@/lib/api'
import { getToken } from '@/lib/session'

// null = no hay sesión válida: el navegador sigue usando sus favoritos locales
export async function fetchFavoriteIdsAction(): Promise<string[] | null> {
  const token = await getToken()
  if (!token) return null
  const result = await getFavoriteIds(token)
  return result.ok ? result.data : null
}

export async function setFavoriteAction(productId: string, on: boolean): Promise<boolean> {
  const token = await getToken()
  if (!token) return false
  const result = on ? await addFavoriteRequest(token, productId) : await removeFavoriteRequest(token, productId)
  return result.ok
}

export async function mergeFavoritesAction(productIds: string[]): Promise<string[] | null> {
  const token = await getToken()
  if (!token) return null
  const result = await mergeFavoritesRequest(token, productIds.slice(0, 100))
  return result.ok ? result.data : null
}

export async function getProductsByIdsAction(ids: string[]): Promise<Product[]> {
  const list = ids.slice(0, 50)
  if (list.length === 0) return []
  try {
    const { data } = await getProducts({ ids: list.join(','), limit: list.length })
    const byId = new Map(data.map((p) => [p.id, p]))
    return list.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p))
  } catch {
    return []
  }
}
