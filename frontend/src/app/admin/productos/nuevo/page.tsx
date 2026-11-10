import Link from 'next/link'
import { getAdminStats, getAdminCategories, getAdminSuppliers, getDepartments } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'
import { PageHeader } from '@/components/admin/AdminUI'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Nuevo producto' }

export default async function NewProductPage() {
  const token = await requireAdminToken()
  const [categories, suppliers, departments, stats] = await Promise.all([getAdminCategories(token), getAdminSuppliers(token), getDepartments(), getAdminStats(token)])

  return (
    <>
      <Link href="/admin/productos" className="text-sm animated-underline" style={{ color: 'var(--color-text-muted)' }}>
        ← Productos
      </Link>
      <div className="mt-3">
        <PageHeader title="Nuevo producto" description="Se crea como borrador; lo publicas cuando tenga fotos." />
      </div>
      <ProductForm categories={categories.ok ? categories.data : []} suppliers={suppliers.ok ? suppliers.data : []} departments={departments}
        featured={{ count: stats.ok ? stats.data.featured : 0, max: stats.ok ? stats.data.maxFeatured : 4 }} />
    </>
  )
}
