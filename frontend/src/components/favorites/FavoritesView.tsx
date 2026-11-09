'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProductsByIdsAction } from '@/app/actions/favorites'
import type { Product } from '@/lib/api'
import { useProfileInitial } from '@/lib/useProfileInitial'
import ProductCard from '@/components/store/ProductCard'
import { useFavorites } from './FavoritesProvider'

const grid = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'

export default function FavoritesView() {
  const { ids, ready } = useFavorites()
  const loggedIn = useProfileInitial() !== null
  const [products, setProducts] = useState<Map<string, Product>>(new Map())
  const [requested, setRequested] = useState<Set<string>>(new Set())

  // solo se piden las piezas que aún no se han pedido (quitar una no recarga la lista)
  const missingKey = ids.filter((id) => !requested.has(id)).join(',')
  const loading = !ready || missingKey !== ''

  useEffect(() => {
    if (!ready || !missingKey) return
    const missing = missingKey.split(',')
    let cancelled = false
    getProductsByIdsAction(missing).then((list) => {
      if (cancelled) return
      setProducts((prev) => new Map([...prev, ...list.map((p) => [p.id, p] as const)]))
      setRequested((prev) => new Set([...prev, ...missing]))
    })
    return () => {
      cancelled = true
    }
  }, [ready, missingKey])

  const visible = ids.map((id) => products.get(id)).filter((p): p is Product => Boolean(p))
  const count = visible.length

  return (
    <>
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-10 lg:px-[3%] pt-10 pb-7 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
            Tus piezas guardadas
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Favoritos
        </h1>
        {!loading && count > 0 && (
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {count === 1 ? '1 pieza' : `${count} piezas`}
          </p>
        )}
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 lg:px-[3%] py-8 pb-16">
        {!loggedIn && ready && count > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-5 sm:p-6 mb-8" style={{ backgroundColor: 'var(--color-surface)' }}>
            <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Tus favoritos solo están guardados en este dispositivo. Inicia sesión para no perderlos y verlos desde cualquier lugar.
            </p>
            <Link href="/ingresar?next=/favoritos" className="btn-pill shrink-0">
              Iniciar sesión
            </Link>
          </div>
        )}

        {loading ? (
          <div className={grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div
                  className="rounded-lg mb-3"
                  style={{
                    aspectRatio: '3 / 4',
                    background: 'linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-alt) 50%, var(--color-surface) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease-in-out infinite',
                  }}
                />
                <div className="h-3 w-2/3 rounded mb-2" style={{ backgroundColor: 'var(--color-surface)' }} />
                <div className="h-3 w-1/3 rounded" style={{ backgroundColor: 'var(--color-surface)' }} />
              </div>
            ))}
          </div>
        ) : count === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 sm:py-20">
            <span
              className="inline-flex items-center justify-center rounded-full mb-6"
              style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Aún no tienes favoritos
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Toca el corazón en cualquier pieza para guardarla aquí y volver a verla cuando quieras.
            </p>
            <Link href="/tienda" className="btn-pill">
              Explorar la tienda
            </Link>
          </div>
        ) : (
          <div className={grid}>
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
