'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

type LenisLike = { stop: () => void; start: () => void }

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis
    lenis?.stop()
    const frame = requestAnimationFrame(() => lenis?.start())
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  // solo opacidad: un transform rompe los position: fixed
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
