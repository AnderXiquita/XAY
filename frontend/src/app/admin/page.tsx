import Link from 'next/link'
import { getAdminStats } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'
import { Card, ErrorNote, PageHeader } from '@/components/admin/AdminUI'

export const metadata = { title: 'Resumen' }

export default async function AdminHomePage() {
  const token = await requireAdminToken()
  const result = await getAdminStats(token)

  return (
    <>
      <PageHeader
        title="Resumen"
        description="Cómo está la tienda hoy."
        action={
          <Link href="/admin/productos/nuevo" className="btn-pill">
            Nuevo producto
          </Link>
        }
      />

      {!result.ok ? (
        <ErrorNote message={result.error.error} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Disponibles', value: result.data.products.available, href: '/admin/productos?status=available' },
            { label: 'Borradores', value: result.data.products.draft, href: '/admin/productos?status=draft' },
            { label: 'Vendidos', value: result.data.products.sold, href: '/admin/productos?status=sold' },
            { label: 'Próximamente', value: result.data.products.coming_soon, href: '/admin/productos?status=coming_soon' },
            { label: 'Destacados en la home', value: `${result.data.featured} de ${result.data.maxFeatured}`, href: '/admin/productos' },
            { label: 'Clientes activos', value: result.data.users, href: '/admin/usuarios' },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="block transition-transform hover:-translate-y-0.5">
              <Card className="p-5 h-full">
                <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-text-muted)' }}>
                  {stat.label}
                </p>
                <p className="text-3xl mt-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                  {stat.value}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Card className="p-5 mt-6">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Pedidos
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Aquí verás los pedidos y podrás confirmar pagos cuando activemos el checkout.
        </p>
      </Card>
    </>
  )
}
