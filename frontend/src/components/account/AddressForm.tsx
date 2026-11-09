'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { saveAddressAction, type FormState } from '@/app/actions/account'
import type { Address, Department } from '@/lib/api'
import Field from '@/components/forms/Field'
import FormMessage from '@/components/forms/FormMessage'
import LocationFields from '@/components/forms/LocationFields'
import SubmitButton from '@/components/forms/SubmitButton'

interface AddressFormProps {
  departments: Department[]
  address?: Address | undefined
  defaults: { recipient_name: string; phone: string }
  canBeDefault: boolean
}

export default function AddressForm({ departments, address, defaults, canBeDefault }: AddressFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(saveAddressAction, {})
  const error = (name: string) => state.fieldErrors?.[name]?.[0]
  const initial: Record<string, string> = {
    label: address?.label ?? '',
    recipient_name: address?.recipient_name ?? defaults.recipient_name,
    phone: address?.phone ?? defaults.phone,
    department_id: address ? String(address.department.id) : '',
    municipality_id: address ? String(address.municipality.id) : '',
    zone: address?.zone ?? '',
    address_line: address?.address_line ?? '',
    reference: address?.reference ?? '',
  }
  const value = (name: string) => state.values?.[name] ?? initial[name]

  return (
    <form action={formAction} noValidate className="space-y-5 max-w-xl">
      {address && <input type="hidden" name="id" value={address.id} />}
      <FormMessage error={state.error} />

      <Field label="Nombre de la dirección" name="label" placeholder="Casa, Trabajo…" defaultValue={value('label')} error={error('label')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Quién recibe" name="recipient_name" autoComplete="name" defaultValue={value('recipient_name')} error={error('recipient_name')} />
        <Field label="Teléfono" name="phone" type="tel" autoComplete="tel-national" placeholder="5555 1234" defaultValue={value('phone')} error={error('phone')} />
      </div>

      <LocationFields
        departments={departments}
        defaultDepartmentId={value('department_id')}
        defaultMunicipalityId={value('municipality_id')}
        departmentError={error('department_id')}
        municipalityError={error('municipality_id')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-2">
          <Field label="Dirección" name="address_line" autoComplete="street-address" placeholder="4a calle 5-20" defaultValue={value('address_line')} error={error('address_line')} />
        </div>
        <Field label="Zona" name="zone" optional placeholder="10" defaultValue={value('zone')} error={error('zone')} />
      </div>

      <Field
        label="Referencias"
        name="reference"
        multiline
        optional
        placeholder="Frente a la iglesia, portón negro"
        defaultValue={value('reference')}
        error={error('reference')}
        hint="Ayudan al mensajero a encontrarte"
      />

      {canBeDefault && (
        <label className="flex items-center gap-3 cursor-pointer" style={{ minHeight: '44px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          <input
            type="checkbox"
            name="is_default"
            defaultChecked={state.values ? state.values.is_default === 'on' : false}
            className="accent-[#091F2C]"
            style={{ width: '18px', height: '18px' }}
          />
          Usar como dirección principal
        </label>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
        <Link href="/cuenta/direcciones" className="btn-pill btn-pill-quiet">
          Cancelar
        </Link>
        <SubmitButton pendingText="Guardando…">{address ? 'Guardar cambios' : 'Guardar dirección'}</SubmitButton>
      </div>
    </form>
  )
}
