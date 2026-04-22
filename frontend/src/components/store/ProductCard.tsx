'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/api'
import ImageLightbox from './ImageLightbox'

interface ProductCardProps {
  product: Product
  listMode?: boolean
}

function StatusBadge({ status }: { status: Product['status'] }) {
  if (status === 'available') return null

  const labels: Record<string, string> = {
    sold: 'Vendido',
    coming_soon: 'Próximamente',
    draft: 'Borrador',
  }

  const soldStyle = {
    backgroundColor: 'rgba(255, 251, 244, 0.08)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    color: 'rgba(255, 251, 244, 0.75)',
  }

  const defaultStyle = {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-text-inverse)',
  }

  return (
    <span
      className="absolute top-3 left-3 z-10 px-4 py-1.5 text-xs rounded-full"
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: status === 'sold' ? 200 : 500,
        letterSpacing: '0.08em',
        ...(status === 'sold' ? soldStyle : defaultStyle),
      }}
    >
      {labels[status] ?? status}
    </span>
  )
}

/* ── BOTÓN ÍCONO REUTILIZABLE (corazón u ojo) ──
   Desktop: aparece en hover deslizando desde la derecha.
   Mobile: siempre visible.
   `forceActive` mantiene el fondo oscuro aunque no haya hover (para cuando el favorito está activo). */
function CardIconButton({
  onClick,
  isCardHovered,
  ariaLabel,
  mobile = false,
  forceActive = false,
  position,
  children,
}: {
  onClick: (e: React.MouseEvent) => void
  isCardHovered: boolean
  ariaLabel: string
  mobile?: boolean
  forceActive?: boolean
  position: { top?: string; bottom?: string; left?: string; right?: string }
  children: React.ReactNode
}) {
  const [isHovered, setIsHovered] = useState(false)

  const isDark = isHovered || forceActive

  const size = mobile ? '32px' : '40px'

  const style: React.CSSProperties = {
    position: 'absolute',
    ...position,
    zIndex: 10,
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    backgroundColor: isDark ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.92)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'background-color 250ms ease',
    cursor: 'pointer',
  }

  if (!mobile) {
    style.opacity = isCardHovered ? 1 : 0
    style.transform = isCardHovered ? 'translateX(0)' : 'translateX(14px)'
    style.transition = `opacity 500ms ease, transform 500ms ease, background-color 250ms ease`
    style.pointerEvents = isCardHovered ? 'auto' : 'none'
  }

  function handleTouchEnd(e: React.TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
    onClick(e as unknown as React.MouseEvent)
  }

  return (
    <button
      onClick={onClick}
      onTouchEnd={handleTouchEnd}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      <span style={{ color: isDark ? 'white' : 'var(--color-text-primary)', transition: 'color 250ms ease', display: 'flex' }}>
        {children}
      </span>
    </button>
  )
}

function HeartSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 350ms ease' }}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function EyeSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function ProductCard({ product, listMode = false }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const mainImage =
    product.images.find((img) => img.type === 'main') ?? product.images[0]

  const origin = product.municipality
    ? `${product.municipality.name}, ${product.department?.name ?? ''}`
    : product.department?.name ?? null

  const isSold = product.status === 'sold'

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(prev => !prev)
  }

  function openLightbox(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setLightboxOpen(true)
  }

  if (listMode) {
    return (
      <>
        <article
          className="group flex gap-4 sm:gap-5"
          style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          {/* Imagen */}
          <Link href={`/tienda/${product.slug}`} className="shrink-0" style={{ display: 'block' }}>
            <div
              className="relative overflow-hidden w-28 sm:w-44"
              style={{ aspectRatio: '3/4', backgroundColor: 'var(--color-border)', borderRadius: '8px', transform: 'translateZ(0)' }}
            >
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt_text ?? product.name}
                  fill
                  loading="eager"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 112px, 176px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Sin imagen</span>
                </div>
              )}
              {isSold && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(44,24,16,0.35)' }} />}
              <StatusBadge status={product.status} />
            </div>
          </Link>

          {/* Info + acciones */}
          <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
            <Link href={`/tienda/${product.slug}`} className="block">
              {origin && (
                <p className="uppercase truncate mb-1" style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
                  {origin}
                </p>
              )}
              <h3 className="leading-snug mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {product.name}
              </h3>
              {product.description && (
                <p className="line-clamp-3 hidden sm:block mb-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {product.description}
                </p>
              )}
              {isSold ? (
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Vendido —</span>
                  {product.allow_similar_request && (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-accent)', fontWeight: 500 }}>Solicitar similar</span>
                  )}
                </div>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '1rem', color: 'var(--color-accent)' }}>
                  Q{parseFloat(product.price).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
              )}
            </Link>

            {/* Botones favorito + lightbox */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={toggleFavorite}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                className="flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: '36px', height: '36px',
                  backgroundColor: isFavorite ? 'var(--color-text-primary)' : 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: isFavorite ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                <HeartSVG />
              </button>
              <button
                onClick={openLightbox}
                aria-label="Ver imágenes"
                className="flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: '36px', height: '36px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-border)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)' }}
              >
                <EyeSVG />
              </button>
            </div>
          </div>
        </article>

        {lightboxOpen && product.images.length > 0 && (
          <ImageLightbox
            images={product.images}
            initialIndex={0}
            productName={product.name}
            productSlug={product.slug}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(prev => !prev)}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Link href={`/tienda/${product.slug}`} className="group block">
        <article
          className="transition-shadow duration-250"
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          {/* Imagen — ratio 3:4, esquinas redondeadas en las 4 */}
          <div
            className="relative overflow-hidden mb-3"
            style={{ aspectRatio: '3/4', backgroundColor: 'var(--color-border)', borderRadius: '9px', transform: 'translateZ(0)' }}
          >
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt_text ?? product.name}
                fill
                loading="eager"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>Sin imagen</span>
              </div>
            )}

            {isSold && (
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(44,24,16,0.35)' }} />
            )}

            <StatusBadge status={product.status} />

            {/* ── DESKTOP: corazón y ojo en hover (esquina derecha, apilados) ── */}
            <div className="hidden lg:block">
              <CardIconButton
                onClick={toggleFavorite}
                isCardHovered={isCardHovered}
                ariaLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                mobile={false}
                forceActive={isFavorite}
                position={{ top: '12px', right: '12px' }}
              >
                <HeartSVG />
              </CardIconButton>

              <CardIconButton
                onClick={openLightbox}
                isCardHovered={isCardHovered}
                ariaLabel="Ver imágenes"
                mobile={false}
                position={{ top: '60px', right: '12px' }}
              >
                <EyeSVG />
              </CardIconButton>
            </div>

            {/* ── MOBILE: ojo arriba, corazón abajo — misma esquina derecha ── */}
            <div className="lg:hidden">
              <CardIconButton
                onClick={openLightbox}
                isCardHovered={isCardHovered}
                ariaLabel="Ver imágenes"
                mobile={true}
                position={{ bottom: '52px', right: '10px' }}
              >
                <EyeSVG />
              </CardIconButton>

              <CardIconButton
                onClick={toggleFavorite}
                isCardHovered={isCardHovered}
                ariaLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                mobile={true}
                forceActive={isFavorite}
                position={{ bottom: '10px', right: '10px' }}
              >
                <HeartSVG />
              </CardIconButton>
            </div>
          </div>

          {/* Info */}
          <div>
            {origin && (
              <p className="mb-1 truncate uppercase" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
                {origin}
              </p>
            )}

            <h3 className="mb-1 leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {product.name}
            </h3>

            {isSold ? (
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Vendido —</span>
                {product.allow_similar_request && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 500 }}>Solicitar similar</span>
                )}
              </div>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-accent)' }}>
                Q{parseFloat(product.price).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </article>
      </Link>

      {/* Lightbox — fuera del Link para evitar navegación accidental */}
      {lightboxOpen && product.images.length > 0 && (
        <ImageLightbox
          images={product.images}
          initialIndex={0}
          productName={product.name}
          productSlug={product.slug}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite(prev => !prev)}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
