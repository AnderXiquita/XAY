import { getAdminSuppliers } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'
import { Card, ErrorNote, PageHeader } from '@/components/admin/AdminUI'
import CatalogItemForm from '@/components/admin/CatalogItemForm'

export const metadata = { title: 'Proveedores' }

export default async function AdminSuppliersPage() {
  const token = await requireAdminToken()
  const result = await getAdminSuppliers(token)

  return (
    <>
      <PageHeader title="Proveedores" description="Solo para complementos modernos. La ropa típica se trabaja directo con las artesanas." />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 space-y-3">
          {!result.ok ? (
            <ErrorNote message={result.error.error} />
          ) : result.data.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Aún no hay proveedores.
              </p>
            </Card>
          ) : (
            result.data.map((s) => <CatalogItemForm key={s.id} kind="supplier" item={s} />)
          )}
        </div>
        <div className="lg:col-span-2 lg:sticky lg:top-6">
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Nuevo proveedor
          </p>
          <CatalogItemForm kind="supplier" />
        </div>
      </div>
    </>
  )
}
