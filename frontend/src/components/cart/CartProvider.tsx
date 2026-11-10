'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { addManyToCartAction, addToCartAction, getCartAction, removeFromCartAction, updateCartItemAction, type CartResult } from '@/app/actions/cart'
import { EMPTY_CART, type Cart } from '@/lib/api'
import { readProfileInitial } from '@/lib/useProfileInitial'

export interface CartNotice {
  kind: 'added' | 'error' | 'info'
  message: string
}

interface CartContextValue {
  cart: Cart
  ready: boolean
  busy: string | null
  drawerOpen: boolean
  notice: CartNotice | null
  inCart: (productId: string) => boolean
  add: (productId: string, name: string) => Promise<void>
  addMany: (productIds: string[]) => Promise<void>
  update: (productId: string, quantity: number) => Promise<void>
  remove: (productId: string) => Promise<void>
  openDrawer: () => void
  closeDrawer: () => void
  dismissNotice: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [cart, setCart] = useState<Cart>(EMPTY_CART)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  // el panel se abre en una página; al navegar a otra se cierra solo
  const [drawerPath, setDrawerPath] = useState<string | null>(null)
  const drawerOpen = drawerPath === pathname
  const [notice, setNotice] = useState<CartNotice | null>(null)
  const loggedIn = useRef<boolean | null>(null)

  // se vuelve a pedir el carrito al iniciar o cerrar sesión (el login ya une el carrito de invitado)
  useEffect(() => {
    const logged = readProfileInitial() !== null
    if (logged === loggedIn.current) return
    loggedIn.current = logged
    getCartAction().then((next) => {
      setCart(next)
      setReady(true)
    })
  }, [pathname])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 4500)
    return () => clearTimeout(timer)
  }, [notice])

  const apply = useCallback((result: CartResult) => {
    if (result.ok) {
      setCart(result.cart)
      return true
    }
    setNotice({ kind: 'error', message: result.error })
    getCartAction().then(setCart)
    return false
  }, [])

  const add = useCallback(
    async (productId: string, name: string) => {
      setBusy(productId)
      const ok = apply(await addToCartAction(productId))
      setBusy(null)
      if (!ok) return
      if (isDesktop()) setDrawerPath(pathname)
      else setNotice({ kind: 'added', message: `${name} se agregó a tu carrito` })
    },
    [apply, pathname],
  )

  const addMany = useCallback(async (productIds: string[]) => {
    setBusy('many')
    const { cart: next, added, skipped } = await addManyToCartAction(productIds)
    setBusy(null)
    setCart(next)
    const plural = (n: number) => (n === 1 ? '1 pieza' : `${n} piezas`)
    const message = skipped
      ? `Agregamos ${plural(added)} a tu carrito; ${plural(skipped)} ya no ${skipped === 1 ? 'está disponible' : 'están disponibles'}`
      : `Agregamos ${plural(added)} a tu carrito`
    if (added && isDesktop()) setDrawerPath(pathname)
    setNotice({ kind: added ? 'added' : 'info', message })
  }, [pathname])

  const update = useCallback(
    async (productId: string, quantity: number) => {
      setBusy(productId)
      apply(await updateCartItemAction(productId, quantity))
      setBusy(null)
    },
    [apply],
  )

  const remove = useCallback(
    async (productId: string) => {
      setBusy(productId)
      apply(await removeFromCartAction(productId))
      setBusy(null)
    },
    [apply],
  )

  const openDrawer = useCallback(() => setDrawerPath(pathname), [pathname])
  const closeDrawer = useCallback(() => setDrawerPath(null), [])
  const dismissNotice = useCallback(() => setNotice(null), [])

  const inCart = useCallback((productId: string) => cart.items.some((line) => line.product_id === productId), [cart])

  return (
    <CartContext.Provider
      value={{
        cart,
        ready,
        busy,
        drawerOpen,
        notice,
        inCart,
        add,
        addMany,
        update,
        remove,
        openDrawer,
        closeDrawer,
        dismissNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
