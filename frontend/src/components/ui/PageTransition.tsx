'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

type LenisLike = { stop: () => void; start: () => void }

/* Transición entre pantallas: cada vez que cambia la ruta, la página nueva aparece con un fade.
   - Se usa la ruta como `key` para que el contenido se vuelva a montar y la animación corra de nuevo.
   - Solo se anima la opacidad: un `transform` en este contenedor haría que los elementos
     `position: fixed` de las páginas (barra del botón en mobile, lightbox, bottom sheet)
     se posicionen respecto al contenedor y no a la pantalla mientras dura la animación.
   - Al cambiar de ruta se corta el impulso de Lenis para que el scroll de la página anterior
     no siga moviendo la nueva (mismo patrón stop/start del CLAUDE.md). */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis
    lenis?.stop()
    const frame = requestAnimationFrame(() => lenis?.start())
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
