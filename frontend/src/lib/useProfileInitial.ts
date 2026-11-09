'use client'

import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { PROFILE_COOKIE } from './auth-cookie'

export function readProfileInitial(): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${PROFILE_COOKIE}=`))
  return match ? decodeURIComponent(match.slice(PROFILE_COOKIE.length + 1)) || null : null
}

const subscribe = () => () => {}

// usePathname hace que se vuelva a leer en cada navegación (login/logout terminan en un redirect)
export function useProfileInitial() {
  usePathname()
  return useSyncExternalStore(subscribe, readProfileInitial, () => null)
}
