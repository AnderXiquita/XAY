import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionTitle } from '@/components/account/AccountNav'

export const metadata: Metadata = { title: 'Mis pedidos' }

export default function OrdersPage() {
  return (
    <>
      <SectionTitle title="Mis pedidos" />
      <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Aún no tienes pedidos. Cuando compres una pieza, aquí podrás ver su estado y seguimiento.
        </p>
        <Link href="/tienda" className="btn-pill">
          Explorar la tienda
        </Link>
      </div>
    </>
  )
}
