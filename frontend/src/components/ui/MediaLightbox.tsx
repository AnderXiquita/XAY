'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ProductImage } from '@/lib/api'
import ProductVideo from '@/components/product/ProductVideo'

interface MediaLightboxProps {
  media: ProductImage[]
  initialIndex?: number
  productName: string
  onClose: () => void
  // botones extra arriba a la derecha (ej. favorito) y contenido abajo al centro (ej. "Ver detalles")
  topActions?: React.ReactNode
  bottomCenter?: React.ReactNode
}

type LenisWindow = Window & { __lenis?: { stop: () => void; start: () => void } }

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const BUTTON_STEP = 1.6
const DOUBLE_ZOOM = 2.5
const SWIPE = 50
const DOUBLE_TAP_MS = 300

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

interface Gesture {
  type: 'pan' | 'pinch' | 'swipe' | null
  startX: number
  startY: number
  viewX: number
  viewY: number
  zoom: number
  dist: number
  midX: number
  midY: number
  moved: boolean
}

export default function MediaLightbox({ media, initialIndex = 0, productName, onClose, topActions, bottomCenter }: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [visible, setVisible] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // el zoom y el desplazamiento viven en refs y se aplican directo al DOM para que el gesto sea fluido
  const view = useRef({ z: 1, x: 0, y: 0 })
  const ratio = useRef(1)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<Gesture | null>(null)
  const lastTap = useRef({ time: 0, x: 0, y: 0 })
  const lastPointer = useRef('mouse')

  const current = media[index]
  const isImage = current?.media_type === 'image'

  // tamaño real de la foto dentro del marco (object-contain deja bandas a los lados o arriba)
  const fitted = useCallback(() => {
    const box = boxRef.current
    if (!box) return { fw: 0, fh: 0 }
    const bw = box.clientWidth
    const bh = box.clientHeight
    const r = ratio.current
    return bw / bh > r ? { fw: bh * r, fh: bh } : { fw: bw, fh: bw / r }
  }, [])

  // la foto puede moverse solo hasta que su borde toca el borde de la pantalla: nunca se pierde
  const apply = useCallback(
    (z: number, x: number, y: number, animate = false) => {
      const stage = stageRef.current
      const nz = clamp(z, MIN_ZOOM, MAX_ZOOM)
      const { fw, fh } = fitted()
      const maxX = stage ? Math.max(0, (fw * nz - stage.clientWidth) / 2) : 0
      const maxY = stage ? Math.max(0, (fh * nz - stage.clientHeight) / 2) : 0
      const next = { z: nz, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) }
      view.current = next
      const layer = layerRef.current
      if (layer) {
        layer.style.transition = animate ? 'transform 220ms ease' : 'none'
        layer.style.transform = `translate3d(${next.x}px, ${next.y}px, 0) scale(${next.z})`
      }
      setZoom(nz)
    },
    [fitted],
  )

  // acerca hacia el punto (cx, cy), medido desde el centro del marco
  const zoomAt = useCallback(
    (target: number, cx: number, cy: number, animate = false) => {
      const { z, x, y } = view.current
      const nz = clamp(target, MIN_ZOOM, MAX_ZOOM)
      const k = nz / z
      apply(nz, cx - (cx - x) * k, cy - (cy - y) * k, animate)
    },
    [apply],
  )

  const fromCenter = useCallback((clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { cx: 0, cy: 0 }
    return { cx: clientX - rect.left - rect.width / 2, cy: clientY - rect.top - rect.height / 2 }
  }, [])

  const go = useCallback(
    (delta: number) => {
      view.current = { z: 1, x: 0, y: 0 }
      setZoom(1)
      setIndex((i) => (i + delta + media.length) % media.length)
    },
    [media.length],
  )

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 250)
  }, [onClose])

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    closeRef.current?.focus()
    const lenis = (window as LenisWindow).__lenis
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
      if (isImage && (e.key === '+' || e.key === '=')) zoomAt(view.current.z * BUTTON_STEP, 0, 0, true)
      if (isImage && e.key === '-') zoomAt(view.current.z / BUTTON_STEP, 0, 0, true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, handleClose, isImage, zoomAt])

  // rueda del mouse (y pinza del trackpad, que llega como wheel con ctrlKey); necesita passive: false
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    function onWheel(e: WheelEvent) {
      if (!isImage) return
      e.preventDefault()
      const { cx, cy } = fromCenter(e.clientX, e.clientY)
      const speed = e.ctrlKey ? 0.01 : 0.0018
      zoomAt(view.current.z * Math.exp(-e.deltaY * speed), cx, cy)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [isImage, fromCenter, zoomAt])

  // si cambia el tamaño de la ventana se vuelve a acomodar dentro de los límites
  useEffect(() => {
    const onResize = () => apply(view.current.z, view.current.x, view.current.y)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [apply])

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if ((e.target as HTMLElement).closest('button, a')) return
    lastPointer.current = e.pointerType
    stageRef.current?.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const { z, x, y } = view.current

    if (pointers.current.size === 2 && isImage) {
      const [a, b] = [...pointers.current.values()]
      const mid = fromCenter((a.x + b.x) / 2, (a.y + b.y) / 2)
      gesture.current = { type: 'pinch', startX: 0, startY: 0, viewX: x, viewY: y, zoom: z, dist: Math.hypot(a.x - b.x, a.y - b.y), midX: mid.cx, midY: mid.cy, moved: true }
      return
    }

    const type = isImage && z > 1 ? 'pan' : e.pointerType === 'mouse' ? null : 'swipe'
    gesture.current = { type, startX: e.clientX, startY: e.clientY, viewX: x, viewY: y, zoom: z, dist: 0, midX: 0, midY: 0, moved: false }
    if (type === 'pan') setDragging(true)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (!g) return

    if (g.type === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()]
      const mid = fromCenter((a.x + b.x) / 2, (a.y + b.y) / 2)
      const nz = clamp((g.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / g.dist, MIN_ZOOM, MAX_ZOOM)
      const k = nz / g.zoom
      apply(nz, g.midX - (g.midX - g.viewX) * k + (mid.cx - g.midX), g.midY - (g.midY - g.viewY) * k + (mid.cy - g.midY))
      return
    }

    const dx = e.clientX - g.startX
    const dy = e.clientY - g.startY
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) g.moved = true
    if (g.type === 'pan') apply(view.current.z, g.viewX + dx, g.viewY + dy)
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId)
    const g = gesture.current

    if (g?.type === 'pinch') {
      // al soltar un dedo se sigue arrastrando con el otro
      const rest = [...pointers.current.values()][0]
      if (rest) {
        const { z, x, y } = view.current
        gesture.current = { type: z > 1 ? 'pan' : null, startX: rest.x, startY: rest.y, viewX: x, viewY: y, zoom: z, dist: 0, midX: 0, midY: 0, moved: true }
        return
      }
    }

    gesture.current = null
    setDragging(false)
    if (view.current.z < 1.05) apply(1, 0, 0, true)
    if (!g || g.type === 'pinch') return

    const dx = e.clientX - g.startX
    const dy = e.clientY - g.startY
    if (g.type === 'swipe' && Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1)
      return
    }

    // doble toque en touch (el doble clic del mouse va por onDoubleClick)
    if (e.pointerType !== 'mouse' && !g.moved && isImage) {
      const now = e.timeStamp
      const near = Math.hypot(e.clientX - lastTap.current.x, e.clientY - lastTap.current.y) < 40
      if (now - lastTap.current.time < DOUBLE_TAP_MS && near) {
        toggleZoomAt(e.clientX, e.clientY)
        lastTap.current.time = 0
      } else {
        lastTap.current = { time: now, x: e.clientX, y: e.clientY }
      }
    }
  }

  function toggleZoomAt(clientX: number, clientY: number) {
    if (view.current.z > 1) {
      apply(1, 0, 0, true)
    } else {
      const { cx, cy } = fromCenter(clientX, clientY)
      zoomAt(DOUBLE_ZOOM, cx, cy, true)
    }
  }

  const counter = (n: number) => String(n).padStart(2, '0')
  const zoomed = zoom > 1

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${productName}`}
      style={{
        backgroundColor: `rgba(8, 8, 10, ${visible ? 0.85 : 0})`,
        backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 250ms ease, backdrop-filter 250ms ease',
      }}
    >
      <div
        ref={stageRef}
        className="absolute inset-x-0 overflow-hidden select-none"
        style={{
          top: 'calc(64px + env(safe-area-inset-top, 0px))',
          bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          touchAction: 'none',
          cursor: isImage && zoomed ? (dragging ? 'grabbing' : 'grab') : 'default',
          opacity: visible ? 1 : 0,
          transition: 'opacity 250ms ease',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // en touch el navegador también genera dblclick: ese caso ya lo maneja el doble toque
        onDoubleClick={(e) => isImage && lastPointer.current === 'mouse' && toggleZoomAt(e.clientX, e.clientY)}
      >
        <div ref={boxRef} className="absolute" style={{ inset: '8px clamp(8px, 6vw, 96px)' }}>
          <div
            key={current.id}
            ref={layerRef}
            className="absolute inset-0"
            style={{ transform: 'translate3d(0, 0, 0) scale(1)', animation: 'fadeIn 250ms ease', willChange: 'transform' }}
          >
            {isImage ? (
              <Image
                src={current.url}
                alt={current.alt_text ?? productName}
                fill
                // el doble de resolución para que al hacer zoom el bordado se vea nítido
                sizes="200vw"
                quality={90}
                priority
                draggable={false}
                className="object-contain pointer-events-none"
                onLoad={(e) => {
                  const img = e.currentTarget
                  if (img.naturalWidth && img.naturalHeight) ratio.current = img.naturalWidth / img.naturalHeight
                }}
              />
            ) : (
              <ProductVideo media={current} variant="lightbox" className="absolute inset-0 w-full h-full object-contain" />
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-0 flex items-center justify-end gap-1 px-3"
        style={{ height: 'calc(64px + env(safe-area-inset-top, 0px))', paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {topActions}
        <button
          ref={closeRef}
          type="button"
          onClick={handleClose}
          aria-label="Cerrar galería"
          className="flex items-center justify-center rounded-full transition-colors hover:text-white"
          style={{ width: '44px', height: '44px', color: 'rgba(255, 255, 255, 0.8)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {media.length > 1 && !zoomed && (
        <>
          <ArrowButton direction="prev" onClick={() => go(-1)} />
          <ArrowButton direction="next" onClick={() => go(1)} />
        </>
      )}

      <div
        className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto_1fr] items-center px-5"
        style={{ height: 'calc(72px + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center gap-3 tabular-nums" aria-live="polite" style={{ fontSize: '0.9rem', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.7)' }}>
          <span>{counter(index + 1)}</span>
          <span aria-hidden="true" style={{ width: '28px', height: '1px', backgroundColor: 'currentColor' }} />
          <span>{counter(media.length)}</span>
        </div>

        <div style={{ opacity: zoomed ? 0 : 1, pointerEvents: zoomed ? 'none' : 'auto', transition: 'opacity 200ms ease' }}>{bottomCenter}</div>

        <div className="flex items-center justify-end gap-2">
          {isImage && (
            <>
              <ZoomButton label="Reducir zoom" disabled={zoom <= MIN_ZOOM} onClick={() => zoomAt(view.current.z / BUTTON_STEP, 0, 0, true)}>
                <line x1="5" y1="12" x2="19" y2="12" />
              </ZoomButton>
              <ZoomButton label="Aumentar zoom" disabled={zoom >= MAX_ZOOM} onClick={() => zoomAt(view.current.z * BUTTON_STEP, 0, 0, true)}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </ZoomButton>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ZoomButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex items-center justify-center rounded-full transition-colors duration-150 bg-white/[0.12] enabled:hover:bg-white/[0.22] disabled:opacity-25"
      style={{ width: '40px', height: '40px', color: 'white' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {children}
      </svg>
    </button>
  )
}

function ArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Anterior' : 'Siguiente'}
      className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{ [isPrev ? 'left' : 'right']: 'clamp(4px, 2vw, 32px)', width: '48px', height: '48px' }}
    >
      <span className="flex items-center justify-center rounded-full transition-colors duration-150 bg-white/[0.12] hover:bg-white/[0.22]" style={{ width: '44px', height: '44px', color: 'white' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={isPrev ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
        </svg>
      </span>
    </button>
  )
}
