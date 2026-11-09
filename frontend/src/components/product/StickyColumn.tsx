'use client'

import { useEffect, useRef, useState } from 'react'

const HEADER_OFFSET = 104
const BOTTOM_GAP = 24

export default function StickyColumn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(HEADER_OFFSET)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function update() {
      if (!el) return
      // si no cabe en pantalla, se fija mostrando su final
      const overflow = window.innerHeight - el.offsetHeight - BOTTOM_GAP
      setTop(Math.min(HEADER_OFFSET, overflow))
    }

    update()
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
