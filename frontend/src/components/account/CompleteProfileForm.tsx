'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { completeProfileAction, type FormState } from '@/app/actions/account'
import type { Department } from '@/lib/api'
import AuthShell from '@/components/auth/AuthShell'
import Field from '@/components/forms/Field'
import FormMessage from '@/components/forms/FormMessage'
import LocationFields from '@/components/forms/LocationFields'

interface CompleteProfileFormProps {
  departments: Department[]
  next: string
  defaults: { phone: string; birth_date: string }
}

const FORM_ID = 'complete-profile'

export default function CompleteProfileForm({ departments, next, defaults }: CompleteProfileFormProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(completeProfileAction, {})
  const error = (name: string) => state.fieldErrors?.[name]?.[0]
  const value = (name: string, fallback = '') => state.values?.[name] ?? fallback

  // en desktop los botones van arriba de la foto: quedan fuera del form y lo envían con el atributo form
  const actions = (desktop: boolean) => (
    <div className={desktop ? 'flex gap-3' : 'flex flex-col gap-3 pt-5'}>
      <button type="submit" form={FORM_ID} disabled={pending} className="btn-pill flex-1">
        {pending ? 'Guardando…' : 'Guardar y continuar'}
      </button>
      <Link href={next} className={`btn-pill btn-pill-quiet ${desktop ? 'flex-1' : ''}`}>
        Hacerlo después
      </Link>
    </div>
  )

  return (
    <AuthShell
      eyebrow="Tu cuenta está lista"
      title="Completa tu perfil"
      subtitle="Con estos datos tu primer pedido será más rápido. Si prefieres, puedes hacerlo después."
      image="/image/Departamentos.jpg"
      aside={actions(true)}
    >
      <form id={FORM_ID} action={formAction} noValidate className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <FormMessage error={state.error} />

        <Field
          label="Teléfono"
          name="phone"
          type="tel"
          autoComplete="tel-national"
          placeholder="5555 1234"
          defaultValue={value('phone', defaults.phone)}
          error={error('phone')}
          hint="Para coordinar la entrega de tus pedidos"
        />
        <Field
          label="Fecha de nacimiento"
          name="birth_date"
          type="date"
          autoComplete="bday"
          optional
          max={new Date().toISOString().slice(0, 10)}
          defaultValue={value('birth_date', defaults.birth_date)}
          error={error('birth_date')}
        />

        <div className="flex items-center gap-4 pt-6">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
            Dirección de entrega
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>

        <LocationFields
          departments={departments}
          defaultDepartmentId={value('department_id')}
          defaultMunicipalityId={value('municipality_id')}
          departmentError={error('department_id')}
          municipalityError={error('municipality_id')}
        />
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <Field label="Dirección" name="address_line" autoComplete="street-address" placeholder="4a calle 5-20" defaultValue={value('address_line')} error={error('address_line')} />
          </div>
          <Field label="Zona" name="zone" placeholder="10" defaultValue={value('zone')} error={error('zone')} />
        </div>
        <Field
          label="Referencias"
          name="reference"
          multiline
          optional
          placeholder="Frente a la iglesia, portón negro"
          defaultValue={value('reference')}
          error={error('reference')}
        />

        <div className="lg:hidden">{actions(false)}</div>
      </form>
    </AuthShell>
  )
}
