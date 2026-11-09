import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getToken } from '@/lib/session'
import { getAddresses } from '@/lib/api'
import { SectionTitle } from '@/components/account/AccountNav'
import AddressCard from '@/components/account/AddressCard'

export const metadata: Metadata = { title: 'Mis direcciones' }

const MAX_ADDRESSES = 10

export default async function AddressesPage() {
  const token = await getToken()
  if (!token) redirect('/ingresar?next=/cuenta/direcciones')

  const result = await getAddresses(token)
  const addresses = result.ok ? result.data : []

  return (
    <>
      <SectionTitle title="Mis direcciones" description="Al hacer un pedido eliges a cuál de estas direcciones lo enviamos." />

      {!result.ok && (
        <p className="mb-6 text-sm" style={{ color: 'var(--color-error)' }}>
          {result.error.error}
        </p>
      )}

      {addresses.length === 0 && result.ok ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Aún no tienes direcciones guardadas.
          </p>
          <Link href="/cuenta/direcciones/nueva" className="btn-pill">
            Agregar dirección
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
          {addresses.length < MAX_ADDRESSES && (
            <Link href="/cuenta/direcciones/nueva" className="btn-pill w-full sm:w-auto mt-8">
              Agregar otra dirección
            </Link>
          )}
        </>
      )}
    </>
  )
}
