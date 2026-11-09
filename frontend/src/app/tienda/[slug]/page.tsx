import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/lib/api'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import StickyColumn from '@/components/product/StickyColumn'
import ProductCard from '@/components/store/ProductCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }

  const origin = [product.municipality?.name, product.department?.name].filter(Boolean).join(', ')
  const mainImage = product.images.find((m) => m.media_type === 'image' && m.type === 'main')
    ?? product.images.find((m) => m.media_type === 'image')

  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? `${product.name}${origin ? ` — ${origin}` : ''}`,
    openGraph: {
      title: product.name,
      description: origin || undefined,
      images: mainImage?.url.startsWith('http') ? [{ url: mainImage.url, alt: mainImage.alt_text ?? product.name }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const [product, related] = await Promise.all([getProductBySlug(slug), getRelatedProducts(slug, 4)])

  if (!product) notFound()

  const sameDepartment = related.basis === 'department' && product.department
  const relatedTitle = sameDepartment ? `Más piezas de ${product.department!.name}` : 'También te puede gustar'

  return (
    <div className="page-transition max-w-screen-2xl mx-auto lg:px-[3%] pb-24 lg:pb-0">
      <nav aria-label="Ruta" className="hidden lg:block pt-8 pb-6">
        <ol className="flex items-center gap-3" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          <li><Link href="/tienda" className="animated-underline" style={{ color: 'var(--color-text-secondary)' }}>Tienda</Link></li>
          <li aria-hidden="true">·</li>
          <li><Link href="/tienda" className="animated-underline" style={{ color: 'var(--color-text-secondary)' }}>{product.category.name}</Link></li>
          <li aria-hidden="true">·</li>
          <li aria-current="page" className="truncate">{product.name}</li>
        </ol>
      </nav>

      {/* sin items-start: la columna derecha tiene que estirarse para que funcione el sticky */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-16">
        <div className="relative pt-3 lg:pt-0 lg:col-span-7 xl:col-span-8">
          <Link
            href="/tienda"
            aria-label={`Volver a la tienda (${product.category.name})`}
            className="lg:hidden absolute z-10 flex items-center justify-center"
            style={{ top: '16px', left: '20px', width: '44px', height: '44px' }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(255, 251, 244, 0.9)',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--color-text-primary)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </span>
          </Link>

          <ProductGallery media={product.images} productName={product.name} />
        </div>

        <div className="px-4 pt-4 lg:px-0 lg:pt-0 lg:col-span-5 xl:col-span-4">
          <StickyColumn>
            <ProductInfo product={product} />
          </StickyColumn>
        </div>
      </div>

      {related.data.length === 0 && (
        <div className="flex justify-center px-4 pt-16 pb-8 lg:pt-24 lg:pb-24">
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center rounded-full border px-8 uppercase transition-colors duration-300 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)]"
            style={{ minHeight: '48px', fontSize: '0.8rem', letterSpacing: '0.12em', fontWeight: 500 }}
          >
            Seguir explorando la tienda
          </Link>
        </div>
      )}

      {related.data.length > 0 && (
        <section className="px-4 lg:px-0 pt-20 lg:pt-28 pb-8 lg:pb-24">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
                {sameDepartment ? 'Mismo origen' : 'Piezas similares'}
              </span>
              <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              {relatedTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6">
            {related.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
