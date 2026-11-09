import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession, getToken } from '@/lib/session'
import { getAddresses, getDepartments } from '@/lib/api'
import { SectionTitle } from '@/components/account/AccountNav'
import AddressForm from '@/components/account/AddressForm'

export const metadata: Metadata = { title: 'Nueva dirección' }

export default async function NewAddressPage() {
  const [user, token] = await Promise.all([getSession(), getToken()])
  if (!user || !token) redirect('/ingresar?next=/cuenta/direcciones/nueva')

  const [departments, addresses] = await Promise.all([getDepartments(), getAddresses(token)])
  const hasAddresses = addresses.ok && addresses.data.length > 0

  return (
    <>
      <SectionTitle title="Nueva dirección" />
      <AddressForm
        departments={departments}
        defaults={{ recipient_name: user.name, phone: user.phone ?? '' }}
        canBeDefault={hasAddresses}
      />
    </>
  )
}
