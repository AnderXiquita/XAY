import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminStats, getAdminCategories, getAdminProduct, getAdminSuppliers, getDepartments } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'
import { PageHeader, StatusBadge } from '@/components/admin/AdminUI'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Editar producto' }

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ nuevo?: string }> }) {
  const [{ id }, { nuevo }] = await Promise.all([params, searchParams])
  const token = await requireAdminToken()
  const [product, categories, suppliers, departments, stats] = await Promise.all([
    getAdminProduct(token, id),
    getAdminCategories(token),
    getAdminSuppliers(token),
    getDepartments(),
    getAdminStats(token),
  ])
  if (!product.ok) notFound()

  return (
    <>
      <Link href="/admin/productos" className="text-sm animated-underline" style={{ color: 'var(--color-text-muted)' }}>
        ← Productos
      </Link>
      <div className="mt-3">
        <PageHeader title={product.data.name} action={<StatusBadge status={product.data.status} />} />
      </div>
      <ProductForm
        product={product.data}
        categories={categories.ok ? categories.data : []}
        suppliers={suppliers.ok ? suppliers.data : []}
        departments={departments}
        featured={{ count: stats.ok ? stats.data.featured : 0, max: stats.ok ? stats.data.maxFeatured : 4 }}
        justCreated={nuevo === '1'}
      />
    </>
  )
}
