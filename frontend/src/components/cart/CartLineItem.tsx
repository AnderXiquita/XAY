'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CartLine } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { useCart } from './CartProvider'

const ISSUE_TEXT = {
  sold: 'Esta pieza ya se vendió',
  unavailable: 'Esta pieza ya no está disponible',
  out_of_stock: 'Ya no hay unidades disponibles',
}

export default function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { update, remove, busy } = useCart()
  const { product } = line
  const photos = product.images.filter((img) => img.media_type === 'image')
  const image = photos.find((img) => img.type === 'main') ?? photos[0]
  const origin = product.municipality && product.department ? `${product.municipality.name}, ${product.department.name}` : product.category.name
  const working = busy === product.id
  const canChangeQuantity = !product.is_traditional && !line.issue && line.max_quantity > 1

  return (
    <article className="flex gap-4 py-5" style={{ opacity: working ? 0.6 : 1, transition: 'opacity 200ms ease' }}>
      <Link
        href={`/tienda/${product.slug}`}
        onClick={onNavigate}
        className="relative shrink-0 overflow-hidden rounded-[4px]"
        style={{ width: '88px', aspectRatio: '3 / 4', backgroundColor: 'var(--color-surface)' }}
      >
        {image && (
          <Image
            src={image.url}
            alt={image.alt_text ?? product.name}
            fill
            sizes="88px"
            loading="eager"
            className="object-cover"
            style={{ filter: line.issue ? 'grayscale(1)' : undefined }}
          />
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-xs uppercase tracking-wider mb-1 truncate" style={{ color: 'var(--color-text-muted)' }}>
          {origin}
        </p>
        <Link
          href={`/tienda/${product.slug}`}
          onClick={onNavigate}
          className="leading-snug mb-1 hover:underline"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-text-primary)' }}
        >
          {product.name}
        </Link>
        <p className="text-sm font-medium" style={{ color: line.issue ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>
          {formatPrice(product.price)}
        </p>

        {line.issue ? (
          <p className="text-xs mt-2" style={{ color: 'var(--color-error)' }}>
            {ISSUE_TEXT[line.issue]}
          </p>
        ) : product.is_traditional ? (
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            Pieza única
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 mt-auto pt-3">
          {canChangeQuantity ? (
            <div className="inline-flex items-center rounded-full border" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                aria-label="Quitar una unidad"
                disabled={working || line.quantity <= 1}
                onClick={() => update(product.id, line.quantity - 1)}
                className="flex items-center justify-center disabled:opacity-40"
                style={{ width: '40px', height: '40px', color: 'var(--color-text-primary)' }}
              >
                −
              </button>
              <span className="text-sm tabular-nums" style={{ minWidth: '20px', textAlign: 'center' }} aria-live="polite">
                {line.quantity}
              </span>
              <button
                type="button"
                aria-label="Agregar una unidad"
                disabled={working || line.quantity >= line.max_quantity}
                onClick={() => update(product.id, line.quantity + 1)}
                className="flex items-center justify-center disabled:opacity-40"
                style={{ width: '40px', height: '40px', color: 'var(--color-text-primary)' }}
              >
                +
              </button>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={working}
            onClick={() => remove(product.id)}
            className="text-sm animated-underline disabled:opacity-50"
            style={{ minHeight: '40px', color: 'var(--color-text-secondary)' }}
          >
            Quitar
          </button>
        </div>
      </div>
    </article>
  )
}
