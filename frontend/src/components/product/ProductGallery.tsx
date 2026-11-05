'use client'

import { useRef, useState } from 'react'
import type { ProductImage } from '@/lib/api'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton'
import ProductVideo from './ProductVideo'
import ProductLightbox from './ProductLightbox'

interface ProductGalleryProps {
  media: ProductImage[]
  productName: string
}

/* Galería del detalle de producto.
   - Mobile: carrusel horizontal que se arrastra, con barra de progreso.
   - Desktop: todas las fotos en grande, en pares. Si la cantidad es impar,
     la primera ocupa el ancho completo para que no quede un hueco al final.
   Click/tap en cualquier elemento abre el lightbox en ese mismo elemento. */
export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0) // 0 → 1 según el scroll del carrusel
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  if (media.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ aspectRatio: '4/5', backgroundColor: 'var(--color-surface)', borderRadius: '6px' }}
      >
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Sin imágenes</span>
      </div>
    )
  }

  const isOdd = media.length % 2 === 1

  function onCarouselScroll() {
    const el = carouselRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  // Contenedor clickeable. Es un div (no <button>) porque el video lleva su propio botón de sonido adentro
  function tileProps(index: number) {
    return {
      role: 'button' as const,
      tabIndex: 0,
      onClick: () => setLightboxIndex(index),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setLightboxIndex(index)
        }
      },
    }
  }

  function renderMedia(item: ProductImage, index: number, sizes: string) {
    if (item.media_type === 'video') {
      return <ProductVideo media={item} variant="gallery" className="absolute inset-0 w-full h-full object-cover" />
    }
    return (
      <ImageWithSkeleton
        src={item.url}
        alt={item.alt_text ?? productName}
        fill
        sizes={sizes}
        // Lenis interfiere con el lazy loading (ver CLAUDE.md): la primera con prioridad, el resto eager
        priority={index === 0}
        loading={index === 0 ? undefined : 'eager'}
        className="object-cover"
      />
    )
  }

  return (
    <>
      {/* ── MOBILE: carrusel ── */}
      <div className="lg:hidden">
        <div
          ref={carouselRef}
          onScroll={onCarouselScroll}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ overscrollBehaviorX: 'contain' }}
          aria-label={`Galería de ${productName}`}
        >
          {media.map((item, i) => (
            <div
              key={item.id}
              {...tileProps(i)}
              className="relative shrink-0 w-full snap-center overflow-hidden"
              style={{ aspectRatio: '4/5', backgroundColor: 'var(--color-surface)' }}
              aria-label={`Ver ${item.media_type === 'video' ? 'video' : 'imagen'} ${i + 1} de ${media.length} en grande`}
            >
              {renderMedia(item, i, '100vw')}
            </div>
          ))}
        </div>

        {/* Barra de progreso: el tramo oscuro avanza conforme se arrastra */}
        {media.length > 1 && (
          <div className="flex items-center gap-3 px-4 mt-3">
            <div className="relative flex-1 overflow-hidden rounded-full" style={{ height: '3px', backgroundColor: 'var(--color-border)' }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${100 / media.length}%`,
                  transform: `translateX(${progress * (media.length - 1) * 100}%)`,
                  backgroundColor: 'var(--color-text-primary)',
                }}
              />
            </div>
            <span className="tabular-nums" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* ── DESKTOP: grid en pares ── */}
      <div className="hidden lg:grid grid-cols-2 gap-2">
        {media.map((item, i) => {
          const isHero = isOdd && i === 0
          return (
            <div
              key={item.id}
              {...tileProps(i)}
              className={`group relative overflow-hidden ${isHero ? 'col-span-2' : ''}`}
              style={{
                // La foto ancha tiene la misma altura que una fila de pares (2 × 4:5 = 8:5)
                aspectRatio: isHero ? '8/5' : '4/5',
                backgroundColor: 'var(--color-surface)',
                borderRadius: '6px',
                cursor: 'zoom-in',
              }}
              aria-label={`Ver ${item.media_type === 'video' ? 'video' : 'imagen'} ${i + 1} de ${media.length} en grande`}
            >
              {renderMedia(item, i, isHero ? '60vw' : '30vw')}
            </div>
          )
        })}
      </div>

      {lightboxIndex !== null && (
        <ProductLightbox
          media={media}
          initialIndex={lightboxIndex}
          productName={productName}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
