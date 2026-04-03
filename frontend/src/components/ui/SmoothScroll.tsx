'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/* Inicializa Lenis para smooth scroll global.
   Se monta una vez en el layout y aplica a toda la app.
   lerp controla la suavidad: más bajo = más suave.
   La instancia se expone en window.__lenis para poder pausarla
   desde otras páginas antes de hacer scrolls programáticos. */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    })

    ;(window as any).__lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      delete (window as any).__lenis
      lenis.destroy()
    }
  }, [])

  return null
}
