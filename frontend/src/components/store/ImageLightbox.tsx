'use client'

import Link from 'next/link'
import type { ProductImage } from '@/lib/api'
import MediaLightbox from '@/components/ui/MediaLightbox'

interface ImageLightboxProps {
  images: ProductImage[]
  initialIndex?: number
  productName: string
  productSlug: string
  isFavorite: boolean
  onToggleFavorite: () => void
  onClose: () => void
}

export default function ImageLightbox({ images, initialIndex = 0, productName, productSlug, isFavorite, onToggleFavorite, onClose }: ImageLightboxProps) {
  return (
    <MediaLightbox
      media={images}
      initialIndex={initialIndex}
      productName={productName}
      onClose={onClose}
      topActions={
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={isFavorite}
          className="flex items-center justify-center rounded-full"
          style={{ width: '44px', height: '44px' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isFavorite ? 'white' : 'none'} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'fill 200ms ease' }}>
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      }
      bottomCenter={
        <Link
          href={`/tienda/${productSlug}`}
          onClick={onClose}
          className="inline-flex items-center rounded-full border transition-colors border-white/30 text-white/85 hover:border-white/70 hover:text-white"
          style={{ minHeight: '40px', padding: '0 22px', fontSize: '0.8rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}
        >
          Ver detalles
        </Link>
      }
    />
  )
}
