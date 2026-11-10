import Image from 'next/image'
import Link from 'next/link'
import { getAdminProducts, type AdminProduct } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'
import { formatPrice } from '@/lib/format'
import { Card, ErrorNote, FeaturedBadge, PageHeader, Pagination, StatusBadge } from '@/components/admin/AdminUI'

export const metadata = { title: 'Productos' }

const TABS = [
  { value: '', label: 'Todos' },
  { value: 'available', label: 'Disponibles' },
  { value: 'draft', label: 'Borradores' },
  { value: 'sold', label: 'Vendidos' },
  { value: 'coming_soon', label: 'Próximamente' },
]

type Search = { search?: string; status?: string; page?: string }

function origin(p: AdminProduct) {
  return p.municipality && p.department ? `${p.municipality.name}, ${p.department.name}` : p.is_traditional ? 'Sin origen' : 'Complemento moderno'
}

function Thumb({ product }: { product: AdminProduct }) {
  const image = product.images[0]
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: '48px', height: '64px', borderRadius: '4px', backgroundColor: 'var(--color-surface-alt)' }}>
      {image && <Image src={image.url} alt="" fill sizes="128px" loading="eager" className="object-cover" />}
    </div>
  )
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const token = await requireAdminToken()
  const result = await getAdminProducts(token, { search: params.search, status: params.status, page })

  const href = (next: Partial<Search>) => {
    const merged = { search: params.search, status: params.status, ...next }
    const qs = new URLSearchParams(Object.entries(merged).filter((e): e is [string, string] => Boolean(e[1]))).toString()
    return `/admin/productos${qs ? `?${qs}` : ''}`
  }

  return (
    <>
      <PageHeader
        title="Productos"
        description={result.ok ? `${result.data.total} en total` : undefined}
        action={
          <Link href="/admin/productos/nuevo" className="btn-pill">
            Nuevo producto
          </Link>
        }
      />

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {TABS.map((tab) => {
            const active = (params.status ?? '') === tab.value
            return (
              <Link
                key={tab.value}
                href={href({ status: tab.value, page: undefined })}
                className="shrink-0 inline-flex items-center rounded-full px-4 text-sm border"
                style={{
                  minHeight: '38px',
                  borderColor: active ? 'var(--color-text-primary)' : 'var(--color-border)',
                  backgroundColor: active ? 'var(--color-text-primary)' : 'var(--color-bg)',
                  color: active ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                }}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
        <form action="/admin/productos" className="lg:ml-auto flex gap-2">
          {params.status && <input type="hidden" name="status" value={params.status} />}
          <input
            type="search"
            name="search"
            defaultValue={params.search}
            placeholder="Buscar por nombre o municipio"
            className="w-full lg:w-72 rounded-full border px-4 outline-none focus:border-[var(--color-accent)]"
            style={{ minHeight: '40px', fontSize: '16px', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </form>
      </div>

      {!result.ok ? (
        <ErrorNote message={result.error.error} />
      ) : result.data.data.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No hay productos con estos filtros.
          </p>
        </Card>
      ) : (
        <>
          <Card className="hidden md:block overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-3 py-3 font-medium">Categoría</th>
                  <th className="px-3 py-3 font-medium">Precio</th>
                  <th className="px-3 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {result.data.data.map((p) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb product={p} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 min-w-0">
                            <span className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                              {p.name}
                            </span>
                            {p.is_featured && <FeaturedBadge />}
                          </p>
                          <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                            {origin(p)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3" style={{ color: 'var(--color-text-secondary)' }}>
                      {p.category.name}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/productos/${p.id}`} className="animated-underline" style={{ color: 'var(--color-text-primary)' }}>
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="md:hidden space-y-3">
            {result.data.data.map((p) => (
              <Link key={p.id} href={`/admin/productos/${p.id}`} className="block">
                <Card className="p-3 flex items-center gap-3">
                  <Thumb product={p} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {p.name}
                    </p>
                    <p className="text-xs truncate mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                      {origin(p)} · {formatPrice(p.price)}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={p.status} />
                      {p.is_featured && <FeaturedBadge />}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <Pagination page={result.data.page} totalPages={result.data.totalPages} href={(n) => href({ page: String(n) })} />
        </>
      )}
    </>
  )
}
