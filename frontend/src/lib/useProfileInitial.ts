'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PROFILE_COOKIE } from './auth-cookie'

// se relee en cada navegación porque login/logout terminan en un redirect
export function useProfileInitial() {
  const pathname = usePathname()
  const [initial, setInitial] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie.split('; ').find((c) => c.startsWith(`${PROFILE_COOKIE}=`))
    setInitial(match ? decodeURIComponent(match.slice(PROFILE_COOKIE.length + 1)) || null : null)
  }, [pathname])

  return initial
}
