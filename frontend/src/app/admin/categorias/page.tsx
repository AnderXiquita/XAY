import { getAdminCategories } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'
import { ErrorNote, PageHeader } from '@/components/admin/AdminUI'
import CatalogItemForm from '@/components/admin/CatalogItemForm'

export const metadata = { title: 'Categorías' }

export default async function AdminCategoriesPage() {
  const token = await requireAdminToken()
  const result = await getAdminCategories(token)

  return (
    <>
      <PageHeader title="Categorías" description="Las categorías inactivas no aparecen en los filtros de la tienda. Nunca se borran." />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 space-y-3">
          {result.ok ? result.data.map((c) => <CatalogItemForm key={c.id} kind="category" item={c} />) : <ErrorNote message={result.error.error} />}
        </div>
        <div className="lg:col-span-2 lg:sticky lg:top-6">
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Nueva categoría
          </p>
          <CatalogItemForm kind="category" />
        </div>
      </div>
    </>
  )
}
