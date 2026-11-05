'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { ProductImage } from '@/lib/api'
import ProductVideo from './ProductVideo'

interface ProductLightboxProps {
  media: ProductImage[]
  initialIndex: number
  productName: string
  onClose: () => void
}

type LenisLike = { stop: () => void; start: () => void }

const ZOOM = 2.5
const SWIPE_THRESHOLD = 50 // px para considerar que el usuario deslizó
const DOUBLE_TAP_MS = 300

/* Vista ampliada de fotos y videos del detalle de producto.
   Fondo claro, flechas circulares, contador "01 —— 07" y X arriba a la derecha.
   - Desktop: click hace zoom en el punto señalado; mover el mouse recorre la foto.
   - Mobile: deslizar cambia de foto; doble tap hace zoom; arrastrar recorre la foto ampliada. */
export default function ProductLightbox({ media, initialIndex, productName, onClose }: ProductLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [visible, setVisible] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  // Punto de origen del zoom en % — moverlo es lo que "recorre" la foto ampliada
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const [panning, setPanning] = useState(false)

  const areaRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pointer = useRef({ x: 0, y: 0, originX: 50, originY: 50, down: false, type: '' })
  const lastTap = useRef(0)

  const current = media[index]
  const isImage = current.media_type === 'image'

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 250)
  }, [onClose])

  const go = useCallback((delta: number) => {
    setZoomed(false)
    setOrigin({ x: 50, y: 50 })
    setIndex((i) => (i + delta + media.length) % media.length)
  }, [media.length])

  // Fade in + foco en la X para que el teclado quede dentro del lightbox
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    closeRef.current?.focus()
  }, [])

  // Bloquear el scroll de la página y pausar Lenis mientras está abierto
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, handleClose])

  // Posición del puntero dentro del área, en %
  function pointToPercent(clientX: number, clientY: number) {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return { x: 50, y: 50 }
    return {
      x: Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)),
    }
  }

  function toggleZoomAt(clientX: number, clientY: number) {
    if (!isImage) return
    if (zoomed) {
      setZoomed(false)
      setOrigin({ x: 50, y: 50 })
    } else {
      setOrigin(pointToPercent(clientX, clientY))
      setZoomed(true)
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    pointer.current = { x: e.clientX, y: e.clientY, originX: origin.x, originY: origin.y, down: true, type: e.pointerType }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!zoomed) return

    // Mouse: la foto ampliada sigue al cursor
    if (e.pointerType === 'mouse') {
      setOrigin(pointToPercent(e.clientX, e.clientY))
      return
    }

    // Touch: arrastrar mueve la foto en la dirección del dedo
    if (!pointer.current.down) return
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    setPanning(true)
    const dx = e.clientX - pointer.current.x
    const dy = e.clientY - pointer.current.y
    setOrigin({
      x: Math.min(100, Math.max(0, pointer.current.originX - (dx / ((ZOOM - 1) * rect.width)) * 100)),
      y: Math.min(100, Math.max(0, pointer.current.originY - (dy / ((ZOOM - 1) * rect.height)) * 100)),
    })
  }

  function onPointerUp(e: React.PointerEvent) {
    const { x, y, down } = pointer.current
    pointer.current.down = false
    setPanning(false)
    if (!down) return

    const dx = e.clientX - x
    const dy = e.clientY - y
    const moved = Math.abs(dx) > 8 || Math.abs(dy) > 8

    if (e.pointerType === 'mouse') {
      if (!moved) toggleZoomAt(e.clientX, e.clientY)
      return
    }

    // Touch sin zoom: deslizar horizontal cambia de foto
    if (!zoomed && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1)
      return
    }

    // Doble tap: zoom
    if (!moved) {
      const now = Date.now()
      if (now - lastTap.current < DOUBLE_TAP_MS) {
        toggleZoomAt(e.clientX, e.clientY)
        lastTap.current = 0
      } else {
        lastTap.current = now
      }
    }
  }

  const counter = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${productName}`}
      style={{
        backgroundColor: 'var(--color-bg)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 250ms ease',
      }}
    >
      {/* ── MEDIA ── */}
      <div
        ref={areaRef}
        className="absolute inset-0 overflow-hidden select-none"
        style={{
          touchAction: 'none',
          cursor: isImage ? (zoomed ? 'zoom-out' : 'zoom-in') : 'default',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointer.current.down = false; setPanning(false) }}
      >
        <div
          key={current.id}
          className="absolute inset-0"
          style={{
            transform: zoomed ? `scale(${ZOOM})` : 'scale(1)',
            transformOrigin: `${origin.x}% ${origin.y}%`,
            // Sin transición mientras se arrastra o se sigue el mouse; suave al entrar/salir del zoom
            transition: panning ? 'none' : 'transform 300ms ease, transform-origin 120ms linear',
            animation: 'fadeIn 250ms ease',
          }}
        >
          {isImage ? (
            <Image
              src={current.url}
              alt={current.alt_text ?? productName}
              fill
              sizes="100vw"
              quality={90}
              priority
              draggable={false}
              className="object-contain"
            />
          ) : (
            <ProductVideo media={current} variant="lightbox" className="absolute inset-0 w-full h-full object-contain" />
          )}
        </div>
      </div>

      {/* ── CERRAR ── */}
      <button
        ref={closeRef}
        type="button"
        onClick={handleClose}
        aria-label="Cerrar galería"
        className="absolute z-10 flex items-center justify-center rounded-full"
        style={{
          top: 'max(12px, env(safe-area-inset-top))',
          right: '12px',
          width: '48px',
          height: '48px',
          color: 'var(--color-text-primary)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── FLECHAS ── se ocultan con zoom para no tapar la foto */}
      {media.length > 1 && !zoomed && (
        <>
          <ArrowButton direction="prev" onClick={() => go(-1)} />
          <ArrowButton direction="next" onClick={() => go(1)} />
        </>
      )}

      {/* ── CONTADOR 01 —— 07 ── */}
      <div
        className="absolute z-10 flex items-center gap-3 tabular-nums pointer-events-none"
        style={{
          left: 'clamp(20px, 3vw, 48px)',
          bottom: 'max(24px, calc(env(safe-area-inset-bottom) + 16px))',
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          color: 'var(--color-text-primary)',
        }}
        aria-live="polite"
      >
        <span>{counter(index + 1)}</span>
        <span aria-hidden="true" style={{ width: '28px', height: '1px', backgroundColor: 'currentColor' }} />
        <span>{counter(media.length)}</span>
      </div>
    </div>
  )
}

function ArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Anterior' : 'Siguiente'}
      // Área táctil de 44px; el círculo visible es de 36px
      className="absolute z-10 top-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{ [isPrev ? 'left' : 'right']: '4px', width: '48px', height: '48px' }}
    >
      <span
        className="flex items-center justify-center rounded-full transition-colors duration-150 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)]"
        style={{ width: '36px', height: '36px', color: 'var(--color-text-inverse)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={isPrev ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
        </svg>
      </span>
    </button>
  )
}
