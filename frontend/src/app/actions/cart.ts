'use server'

import { cookies } from 'next/headers'
import {
  EMPTY_CART,
  addCartItemRequest,
  getCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
  type ApiResult,
  type Cart,
  type CartAuth,
} from '@/lib/api'
import { CART_COOKIE, CART_MAX_AGE, PROFILE_COOKIE, SESSION_COOKIE } from '@/lib/auth-cookie'

export type CartResult = { ok: true; cart: Cart } | { ok: false; error: string; cart?: Cart }

async function readAuth(createGuest: boolean): Promise<CartAuth> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) return { token }

  let session = store.get(CART_COOKIE)?.value
  if (!session && createGuest) {
    session = crypto.randomUUID()
    store.set(CART_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: CART_MAX_AGE,
    })
  }
  return { session }
}

async function finish(result: ApiResult<Cart>, auth: CartAuth): Promise<CartResult> {
  if (result.ok) return { ok: true, cart: result.data }

  // token vencido: se limpia la sesión y se sigue como invitado
  if (result.status === 401 && auth.token) {
    const store = await cookies()
    store.delete(SESSION_COOKIE)
    store.delete(PROFILE_COOKIE)
  }
  return { ok: false, error: result.error.error }
}

export async function getCartAction(): Promise<Cart> {
  const auth = await readAuth(false)
  if (!auth.token && !auth.session) return EMPTY_CART
  const result = await getCartRequest(auth)
  return result.ok ? result.data : EMPTY_CART
}

export async function addToCartAction(productId: string, quantity = 1): Promise<CartResult> {
  const auth = await readAuth(true)
  return finish(await addCartItemRequest(auth, productId, quantity), auth)
}

export async function updateCartItemAction(productId: string, quantity: number): Promise<CartResult> {
  const auth = await readAuth(false)
  return finish(await updateCartItemRequest(auth, productId, quantity), auth)
}

export async function removeFromCartAction(productId: string): Promise<CartResult> {
  const auth = await readAuth(false)
  return finish(await removeCartItemRequest(auth, productId), auth)
}

// para "agregar todo al carrito" desde favoritos: las que ya no están disponibles se cuentan aparte
export async function addManyToCartAction(productIds: string[]): Promise<{ cart: Cart; added: number; skipped: number }> {
  const auth = await readAuth(true)
  let cart: Cart | null = null
  let added = 0
  for (const id of productIds.slice(0, 50)) {
    const result = await addCartItemRequest(auth, id, 1)
    if (result.ok) {
      cart = result.data
      added++
    }
  }
  return { cart: cart ?? (await getCartAction()), added, skipped: productIds.length - added }
}
