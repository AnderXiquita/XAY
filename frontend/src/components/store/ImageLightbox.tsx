'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProductImage } from '@/lib/api'

interface ImageLightboxProps {
  images: ProductImage[]
  initialIndex?: number
  productName: string
  productSlug: string
  isFavorite: boolean
  onToggleFavorite: () => void
  onClose: () => void
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  productName,
  productSlug,
  isFavorite,
  onToggleFavorite,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [visible, setVisible] = useState(false)

  // Refs para gestos: manipulamos DOM directo durante el gesto, React state solo al terminar
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const liveZoom = useRef(1)
  const livePan = useRef({ x: 0, y: 0 })
  const isPinching = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null)

  // Fade in al montar
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // Bloquear scroll del body + pausar Lenis para que no mueva el fondo
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const lenis = (window as any).__lenis
    lenis?.stop()
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [])

  // Resetear zoom al cambiar de imagen
  useEffect(() => {
    liveZoom.current = 1
    livePan.current = { x: 0, y: 0 }
    setZoom(1)
    setPan({ x: 0, y: 0 })
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transition = 'transform 220ms ease, opacity 280ms ease'
      imageWrapperRef.current.style.transform = 'translate(0px, 0px) scale(1)'
    }
  }, [currentIndex])

  // Teclado
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 280)
  }

  function prev() {
    setCurrentIndex(i => (i - 1 + images.length) % images.length)
  }

  function next() {
    setCurrentIndex(i => (i + 1) % images.length)
  }

  function zoomIn() {
    const next = Math.min(liveZoom.current + 0.75, 3)
    liveZoom.current = next
    setZoom(next)
  }

  function zoomOut() {
    const next = Math.max(liveZoom.current - 0.75, 1)
    liveZoom.current = next
    if (next === 1) {
      livePan.current = { x: 0, y: 0 }
      setPan({ x: 0, y: 0 })
    }
    setZoom(next)
  }

  // ── MOUSE drag ──
  function onMouseDown(e: React.MouseEvent) {
    if (zoom <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
  }

  // Clamp basado en el tamaño real renderizado de la imagen (no el viewport completo)
  function clampPan(z: number, x: number, y: number) {
    const el = imageWrapperRef.current
    const imgW = el ? el.offsetWidth : window.innerWidth * 0.88
    const imgH = el ? el.offsetHeight : window.innerHeight * 0.74
    const maxX = Math.max(0, (imgW * z - window.innerWidth) / 2)
    const maxY = Math.max(0, (imgH * z - window.innerHeight) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  // Aplica transform directo al DOM — sin pasar por React, sin transition durante el gesto
  function applyLiveTransform(z: number, x: number, y: number) {
    liveZoom.current = z
    livePan.current = { x, y }
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transition = 'none'
      imageWrapperRef.current.style.transform = `translate(${x}px, ${y}px) scale(${z})`
    }
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging) return
    const raw = {
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    }
    const clamped = clampPan(liveZoom.current, raw.x, raw.y)
    applyLiveTransform(liveZoom.current, clamped.x, clamped.y)
  }

  function onMouseUp() {
    if (isDragging) {
      setPan(livePan.current)
      // Restaura transition suave después del drag
      if (imageWrapperRef.current) {
        imageWrapperRef.current.style.transition = 'transform 220ms ease, opacity 280ms ease'
      }
    }
    setIsDragging(false)
  }

  // ── TOUCH: pinch zoom + drag (mobile) ──
  function getTouchDist(touches: React.TouchList) {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      isPinching.current = true
      pinchStart.current = { dist: getTouchDist(e.touches), zoom: liveZoom.current }
      setIsDragging(false)
      return
    }
    if (liveZoom.current <= 1) return
    const t = e.touches[0]
    dragStart.current = { x: t.clientX, y: t.clientY, panX: livePan.current.x, panY: livePan.current.y }
    setIsDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault()
    if (e.touches.length === 2 && pinchStart.current) {
      const newDist = getTouchDist(e.touches)
      const scale = newDist / pinchStart.current.dist
      const newZoom = Math.max(1, Math.min(3, pinchStart.current.zoom * scale))
      const clamped = clampPan(newZoom, livePan.current.x, livePan.current.y)
      applyLiveTransform(newZoom, clamped.x, clamped.y)
      return
    }
    if (!isDragging) return
    const t = e.touches[0]
    const raw = {
      x: dragStart.current.panX + (t.clientX - dragStart.current.x),
      y: dragStart.current.panY + (t.clientY - dragStart.current.y),
    }
    const clamped = clampPan(liveZoom.current, raw.x, raw.y)
    applyLiveTransform(liveZoom.current, clamped.x, clamped.y)
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2 && isPinching.current) {
      isPinching.current = false
      pinchStart.current = null
      // Commit al state React y restaura transition
      const z = liveZoom.current
      const p = livePan.current
      setZoom(z)
      setPan(z <= 1 ? { x: 0, y: 0 } : p)
      if (imageWrapperRef.current) {
        imageWrapperRef.current.style.transition = 'transform 220ms ease, opacity 280ms ease'
      }
    }
    if (e.touches.length === 0) setIsDragging(false)
  }

  const currentImage = images[currentIndex]

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{
        backgroundColor: `rgba(8, 8, 10, ${visible ? 0.85 : 0})`,
        transition: 'background-color 280ms ease',
        backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
      }}
    >
      {/* ── HEADER ── */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
          paddingBottom: '12px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 280ms ease',
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          className="flex items-center justify-center rounded-full transition-colors duration-150"
          style={{ width: '44px', height: '44px', color: 'rgba(255,255,255,0.8)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'white')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
          {currentIndex + 1} / {images.length}
        </span>

        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ width: '44px', height: '44px' }}
        >
          <svg
            width="22" height="22" viewBox="0 0 24 24"
            fill={isFavorite ? 'white' : 'none'}
            stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'fill 200ms ease' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── IMAGEN ── */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden select-none"
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default', touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 && (
          <button
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-3 z-10 flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div
          ref={imageWrapperRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            opacity: visible ? 1 : 0,
            transition: 'transform 220ms ease, opacity 280ms ease',
          }}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt_text ?? productName}
            width={900}
            height={1100}
            className="object-contain"
            style={{ maxHeight: '74vh', maxWidth: '88vw', width: 'auto', height: 'auto' }}
            draggable={false}
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={next}
            aria-label="Imagen siguiente"
            className="absolute right-3 z-10 flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Botón "Ver detalles" — pegado al borde inferior del área de imagen, centrado */}
        <Link
          href={`/tienda/${productSlug}`}
          onClick={onClose}
          className="absolute bottom-4 z-10"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '9999px',
            padding: '7px 22px',
            whiteSpace: 'nowrap',
            transition: 'opacity 200ms ease, border-color 200ms ease, color 200ms ease',
            opacity: zoom === 1 ? 1 : 0,
            pointerEvents: zoom === 1 ? 'auto' : 'none',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'white'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'
          }}
        >
          Ver detalles
        </Link>
      </div>

      {/* ── FOOTER: dots + "Ver detalles" + zoom ── */}
      <div
        className="shrink-0 px-5 flex items-center justify-between"
        style={{
          paddingTop: '10px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          opacity: visible ? 1 : 0,
          transition: 'opacity 280ms ease',
        }}
      >
        <div className="flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Imagen ${i + 1}`}
              className="rounded-full transition-all duration-250"
              style={{
                width: i === currentIndex ? '22px' : '7px',
                height: '7px',
                backgroundColor: i === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            aria-label="Reducir zoom"
            className="flex items-center justify-center rounded-full transition-colors duration-150 disabled:opacity-25"
            style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            onMouseEnter={e => { if (zoom > 1) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= 3}
            aria-label="Aumentar zoom"
            className="flex items-center justify-center rounded-full transition-colors duration-150 disabled:opacity-25"
            style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            onMouseEnter={e => { if (zoom < 3) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
