import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession, getToken } from '@/lib/session'
import { getAddresses, getDepartments } from '@/lib/api'
import { SectionTitle } from '@/components/account/AccountNav'
import AddressForm from '@/components/account/AddressForm'

export const metadata: Metadata = { title: 'Editar dirección' }

export default async function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [user, token] = await Promise.all([getSession(), getToken()])
  if (!user || !token) redirect('/ingresar?next=/cuenta/direcciones')

  const [departments, addresses] = await Promise.all([getDepartments(), getAddresses(token)])
  const address = addresses.ok ? addresses.data.find((a) => a.id === id) : undefined
  if (!address) notFound()

  return (
    <>
      <SectionTitle title="Editar dirección" />
      <AddressForm
        departments={departments}
        address={address}
        defaults={{ recipient_name: user.name, phone: user.phone ?? '' }}
        canBeDefault={!address.is_default}
      />
    </>
  )
}
