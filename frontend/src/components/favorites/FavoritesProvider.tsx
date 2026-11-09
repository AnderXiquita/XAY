'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { fetchFavoriteIdsAction, mergeFavoritesAction, setFavoriteAction } from '@/app/actions/favorites'
import { readProfileInitial } from '@/lib/useProfileInitial'

const STORAGE_KEY = 'xay_favorites'

interface FavoritesContextValue {
  ids: string[]
  ready: boolean
  isFavorite: (productId: string) => boolean
  toggle: (productId: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function readLocal(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function writeLocal(ids: string[]) {
  try {
    if (ids.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [ids, setIds] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  const idsRef = useRef<string[]>([])
  const loggedIn = useRef<boolean | null>(null)
  const generation = useRef(0)

  const update = useCallback((next: string[]) => {
    idsRef.current = next
    setIds(next)
  }, [])

  // se revisa en cada navegación: así se detecta el login/logout (terminan en redirect)
  useEffect(() => {
    const logged = readProfileInitial() !== null
    if (logged === loggedIn.current) return
    loggedIn.current = logged
    const current = ++generation.current

    // al iniciar sesión, lo que guardó como invitado pasa a su cuenta
    const local = readLocal()
    const request = !logged ? Promise.resolve(null) : local.length ? mergeFavoritesAction(local) : fetchFavoriteIdsAction()
    request.then((serverIds) => {
      if (current !== generation.current) return
      if (serverIds) {
        if (local.length) writeLocal([])
        update(serverIds)
      } else {
        loggedIn.current = false
        update(local)
      }
      setReady(true)
    })
  }, [pathname, update])

  const toggle = useCallback(
    (productId: string) => {
      const prev = idsRef.current
      const on = !prev.includes(productId)
      update(on ? [productId, ...prev] : prev.filter((id) => id !== productId))

      if (!loggedIn.current) {
        writeLocal(idsRef.current)
        return
      }
      setFavoriteAction(productId, on).then((ok) => {
        if (ok) return
        const now = idsRef.current
        update(on ? now.filter((id) => id !== productId) : [productId, ...now])
      })
    },
    [update],
  )

  const isFavorite = useCallback((productId: string) => ids.includes(productId), [ids])

  return <FavoritesContext.Provider value={{ ids, ready, isFavorite, toggle }}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
  return context
}
