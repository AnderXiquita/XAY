'use client'

import { useEffect, useRef, useState } from 'react'

const HEADER_OFFSET = 104 // navbar desktop (80px) + aire
const BOTTOM_GAP = 24

/* Columna que se queda fija mientras la otra columna sigue avanzando.
   Si su contenido cabe en pantalla, se fija arriba (debajo del navbar).
   Si es más alta que la pantalla, se desplaza hasta mostrar su final y ahí se fija,
   para que nunca quede contenido inaccesible. Solo aplica en desktop (lg). */
export default function StickyColumn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(HEADER_OFFSET)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function update() {
      if (!el) return
      const overflow = window.innerHeight - el.offsetHeight - BOTTOM_GAP
      setTop(Math.min(HEADER_OFFSET, overflow))
    }

    update()
    // Se recalcula cuando cambia el alto (acordeones) o el tamaño de la ventana
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={ref} className="lg:sticky" style={{ top: `${top}px` }}>
      {children}
    </div>
  )
}
