'use client'

import { useState } from 'react'
import type { ProductImage } from '@/lib/api'

interface ProductVideoProps {
  media: ProductImage
  variant: 'gallery' | 'lightbox'
  className?: string
}

export default function ProductVideo({ media, variant, className = '' }: ProductVideoProps) {
  const [muted, setMuted] = useState(true)
  const isLightbox = variant === 'lightbox'

  return (
    <>
      <video
        src={media.url}
        poster={media.poster_url ?? undefined}
        className={className}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={media.alt_text ?? undefined}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setMuted((m) => !m)
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
        className={`absolute z-10 flex items-center justify-center rounded-full ${isLightbox ? '' : 'bottom-3 right-3'}`}
        style={
          isLightbox
            ? {
                right: 'clamp(12px, 3vw, 40px)',
                bottom: 'max(14px, calc(env(safe-area-inset-bottom) + 6px))',
                width: '48px',
                height: '48px',
                color: 'var(--color-text-primary)',
              }
            : {
                width: '44px',
                height: '44px',
                backgroundColor: 'rgba(255, 251, 244, 0.92)',
                color: 'var(--color-text-primary)',
                boxShadow: 'var(--shadow-sm)',
              }
        }
      >
        <svg width={isLightbox ? 22 : 18} height={isLightbox ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {muted ? (
            <>
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : (
            <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
          )}
        </svg>
      </button>
    </>
  )
}
