'use client'

import { useState } from 'react'
import type { Product } from '@/lib/api'
import { useFavorites } from '@/components/favorites/FavoritesProvider'
import { formatCm, formatPrice } from '@/lib/format'

const EMBROIDERY_LABELS: Record<NonNullable<Product['embroidery_type']>, string> = {
  hand: 'Bordado a mano',
  machine: 'Bordado a máquina',
  mixed: 'Bordado mixto (a mano y a máquina)',
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function ProductInfo({ product }: { product: Product }) {
  const favorites = useFavorites()
  const isFavorite = favorites.isFavorite(product.id)

  const origin = product.municipality
    ? `${product.municipality.name}, ${product.department?.name ?? ''}`
    : product.department?.name ?? null

  const width = formatCm(product.width_cm)
  const length = formatCm(product.length_cm)
  const hasMeasures = Boolean(width || length || product.size_label || product.size_notes)

  const details = [
    product.fabric_type && { label: 'Tela', value: product.fabric_type },
    product.embroidery_type && { label: 'Técnica', value: EMBROIDERY_LABELS[product.embroidery_type] },
    { label: 'Categoría', value: product.category.name },
    origin && { label: 'Origen', value: origin },
  ].filter((d): d is { label: string; value: string } => Boolean(d))

  return (
    <div>
      {origin && (
        <p className="uppercase mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--color-text-muted)' }}>
          {origin}
        </p>
      )}
      <h1
        className="leading-tight mb-3"
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)', fontWeight: 600, color: 'var(--color-text-primary)' }}
      >
        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <p style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {formatPrice(product.price)}
        </p>
        <StatusPill product={product} />
      </div>

      {/* la ropa típica no usa tallas estándar, se muestran las medidas reales */}
      {hasMeasures && (
        <section className="py-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="uppercase mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.14em', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Medidas de la pieza
          </h2>
          {(width || length) && (
            <div className="flex gap-8 mb-2">
              {width && <Measure label="Ancho" value={width} />}
              {length && <Measure label="Largo" value={length} />}
            </div>
          )}
          {product.size_label && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{product.size_label}</p>
          )}
          {product.size_notes && (
            <p className="mt-1" style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>
              {product.size_notes}
            </p>
          )}
        </section>
      )}

      <div className="hidden lg:flex gap-3 py-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <FavoriteButton isFavorite={isFavorite} onToggle={() => favorites.toggle(product.id)} />
        <PrimaryAction product={product} />
      </div>

      {product.is_traditional && (
        <p className="flex items-center gap-2 pb-5" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5L8 13.8 2 9.2h7.6z" />
          </svg>
          Pieza única, hecha a mano. No hay otra igual.
        </p>
      )}

      <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
        {product.description && (
          <Accordion title="Historia de la pieza" defaultOpen>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>{product.description}</p>
          </Accordion>
        )}

        <Accordion title="Tela y bordado">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2" style={{ fontSize: '0.88rem' }}>
            {details.map((d) => (
              <div key={d.label} className="contents">
                <dt style={{ color: 'var(--color-text-muted)' }}>{d.label}</dt>
                <dd style={{ color: 'var(--color-text-secondary)' }}>{d.value}</dd>
              </div>
            ))}
          </dl>
          {product.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {product.colors.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-full border"
                  style={{ fontSize: '0.78rem', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                >
                  {capitalize(c)}
                </span>
              ))}
            </div>
          )}
        </Accordion>

        <Accordion title="Envío y pago">
          <div className="space-y-2" style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
            <p>Pagas por transferencia o depósito bancario. Al confirmar tu pedido te mostramos los datos de la cuenta y tu número de orden.</p>
            <p>Cuando verificamos el pago preparamos tu pieza y te compartimos el número de rastreo del envío.</p>
          </div>
        </Accordion>
      </div>

      <div
        className="mobile-action-bar lg:hidden fixed left-0 right-0 z-40 flex items-center gap-3 px-4 border-t"
        style={{
          backgroundColor: 'rgba(255, 251, 244, 0.94)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <FavoriteButton isFavorite={isFavorite} onToggle={() => favorites.toggle(product.id)} />
        <PrimaryAction product={product} />
      </div>
    </div>
  )
}

function Measure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }} className="uppercase">{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-text-primary)' }}>{value}</p>
    </div>
  )
}

function StatusPill({ product }: { product: Product }) {
  const label =
    product.status === 'sold' ? 'Vendido'
    : product.status === 'coming_soon' ? 'Próximamente'
    : product.is_traditional ? 'Pieza única'
    : null
  if (!label) return null

  const isSold = product.status === 'sold'
  return (
    <span
      className="px-3 py-1 rounded-full uppercase"
      style={{
        fontSize: '0.68rem',
        letterSpacing: '0.1em',
        fontWeight: 500,
        backgroundColor: isSold ? 'var(--color-surface-alt)' : 'var(--color-accent-subtle)',
        color: 'var(--color-text-secondary)',
      }}
    >
      {label}
    </span>
  )
}

function PrimaryAction({ product }: { product: Product }) {
  const base = 'flex-1 flex items-center justify-center rounded-full uppercase transition-colors duration-200'
  const style: React.CSSProperties = { minHeight: '48px', fontSize: '0.8rem', letterSpacing: '0.12em', fontWeight: 500 }

  if (product.status === 'sold') {
    if (!product.allow_similar_request) {
      return <div className={base} style={{ ...style, color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>Vendido</div>
    }
    return (
      <button
        type="button"
        // TODO: solicitar similar (bloque 12)
        className={`${base} border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)]`}
        style={style}
      >
        Solicitar pieza similar
      </button>
    )
  }

  if (product.status === 'coming_soon') {
    return (
      <button type="button" disabled className={`${base} cursor-not-allowed`} style={{ ...style, color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-alt)' }}>
        Próximamente
      </button>
    )
  }

  return (
    <button
      type="button"
      // TODO: carrito (bloque 7)
      className={`${base} bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-light)]`}
      style={style}
    >
      Agregar al carrito
    </button>
  )
}

function FavoriteButton({ isFavorite, onToggle }: { isFavorite: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={isFavorite}
      className="shrink-0 flex items-center justify-center rounded-full border transition-colors duration-200 hover:bg-[var(--color-surface)]"
      style={{ width: '48px', height: '48px', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'fill 200ms ease' }}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  )
}

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left"
        style={{ minHeight: '56px' }}
      >
        <span style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{title}</span>
        <span aria-hidden="true" style={{ fontSize: '1.2rem', fontWeight: 300, color: 'var(--color-text-muted)', transition: 'transform 250ms ease', transform: open ? 'rotate(45deg)' : 'none' }}>
          +
        </span>
      </button>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 300ms ease' }}>
        <div style={{ minHeight: 0, overflow: 'hidden' }}>
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
