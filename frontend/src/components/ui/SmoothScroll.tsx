'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/* Inicializa Lenis para smooth scroll global.
   Se monta una vez en el layout y aplica a toda la app.
   lerp controla la suavidad: más bajo = más suave. */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return null
}
