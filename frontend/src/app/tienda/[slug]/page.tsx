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

/* ============================================
   DETALLE DE PRODUCTO — /tienda/[slug]
   Se genera en el servidor (SEO y vista previa al compartir por WhatsApp).
   Solo la galería, el lightbox y los botones corren en el navegador.

   Desktop: fotos a la izquierda, información fija a la derecha. Al terminar
   las fotos, las dos columnas suben juntas y aparecen los relacionados.
   Mobile: carrusel arriba, información abajo y botón fijo encima del BottomNav.
   ============================================ */

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
      // Solo URLs absolutas (Cloudinary); las de desarrollo son rutas locales
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
    // pb extra en mobile para que la barra fija del botón no tape el contenido
    // page-transition: fade suave al reemplazar el esqueleto de carga (loading.tsx)
    <div className="page-transition max-w-screen-2xl mx-auto lg:px-[3%] pb-24 lg:pb-0">
      {/* ── MOBILE: volver ── */}
      <Link
        href="/tienda"
        className="lg:hidden inline-flex items-center gap-2 px-4"
        style={{ minHeight: '48px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-primary)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {product.category.name}
      </Link>

      {/* ── DESKTOP: breadcrumb ── */}
      <nav aria-label="Ruta" className="hidden lg:block pt-8 pb-6">
        <ol className="flex items-center gap-3" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          <li><Link href="/tienda" className="animated-underline" style={{ color: 'var(--color-text-secondary)' }}>Tienda</Link></li>
          <li aria-hidden="true">·</li>
          <li><Link href="/tienda" className="animated-underline" style={{ color: 'var(--color-text-secondary)' }}>{product.category.name}</Link></li>
          <li aria-hidden="true">·</li>
          <li aria-current="page" className="truncate">{product.name}</li>
        </ol>
      </nav>

      {/* ── DOS COLUMNAS ──
          Sin items-start a propósito: la celda derecha debe estirarse al alto de la galería
          para que la columna fija tenga recorrido. */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-16">
        <div className="lg:col-span-7 xl:col-span-8">
          <ProductGallery media={product.images} productName={product.name} />
        </div>

        <div className="px-4 pt-6 lg:px-0 lg:pt-0 lg:col-span-5 xl:col-span-4">
          <StickyColumn>
            <ProductInfo product={product} />
          </StickyColumn>
        </div>
      </div>

      {/* ── RELACIONADOS ── */}
      {/* Sin relacionados: cierre con aire para que la página no choque con el footer */}
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
