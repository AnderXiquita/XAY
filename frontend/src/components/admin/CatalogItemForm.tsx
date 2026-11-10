'use client'

import { useActionState, useState } from 'react'
import { saveCategoryAction, saveSupplierAction, type AdminFormState } from '@/app/actions/admin'
import type { AdminCategory, AdminSupplier } from '@/lib/api'
import Field from '@/components/forms/Field'
import SubmitButton from '@/components/forms/SubmitButton'
import { Card } from './AdminUI'
import { useToastOnResult } from './AdminToast'

type Props =
  | { kind: 'category'; item?: AdminCategory | undefined }
  | { kind: 'supplier'; item?: AdminSupplier | undefined }

// formulario de una categoría o un proveedor; sin item es "crear", con item se abre al tocar "Editar"
export default function CatalogItemForm(props: Props) {
  const isCategory = props.kind === 'category'
  const [state, formAction] = useActionState<AdminFormState, FormData>(isCategory ? saveCategoryAction : saveSupplierAction, {})
  const [open, setOpen] = useState(!props.item)
  useToastOnResult(state)
  const error = (name: string) => state.fieldErrors?.[name]?.[0]
  const value = (name: string, fallback: string | null | undefined) => state.values?.[name] ?? fallback ?? ''
  const item = props.item

  if (!open && item) {
    return (
      <Card className="p-4 sm:p-5 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate" style={{ color: item.is_active ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
            {item.name}
            {!item.is_active && <span className="ml-2 text-xs font-normal">(inactivo)</span>}
          </p>
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {props.kind === 'category'
              ? (props.item?.description ?? 'Sin descripción')
              : [props.item?.contact_name, props.item?.phone, props.item?.email].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
          </p>
        </div>
        <span className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
          {item._count.products} {item._count.products === 1 ? 'producto' : 'productos'}
        </span>
        <button type="button" onClick={() => setOpen(true)} className="text-sm animated-underline" style={{ minHeight: '40px', color: 'var(--color-text-primary)' }}>
          Editar
        </button>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <form action={formAction} noValidate className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <Field label="Nombre" name="name" defaultValue={value('name', item?.name)} error={error('name')} />

        {props.kind === 'category' ? (
          <Field label="Descripción" name="description" optional multiline defaultValue={value('description', props.item?.description)} error={error('description')} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Persona de contacto" name="contact_name" optional defaultValue={value('contact_name', props.item?.contact_name)} error={error('contact_name')} />
              <Field label="Teléfono" name="phone" type="tel" optional defaultValue={value('phone', props.item?.phone)} error={error('phone')} />
            </div>
            <Field label="Correo" name="email" type="email" optional defaultValue={value('email', props.item?.email)} error={error('email')} />
            <Field label="Notas" name="notes" optional multiline defaultValue={value('notes', props.item?.notes)} error={error('notes')} />
          </>
        )}

        <label className="flex items-center gap-3 cursor-pointer text-sm" style={{ color: 'var(--color-text-primary)' }}>
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={state.values ? state.values.is_active === 'on' : (item?.is_active ?? true)}
            className="accent-[#091F2C]"
            style={{ width: '18px', height: '18px' }}
          />
          {isCategory ? 'Visible en la tienda' : 'Activo'}
        </label>

        <div className="flex gap-3">
          <SubmitButton pendingText="Guardando…">{item ? 'Guardar' : isCategory ? 'Crear categoría' : 'Crear proveedor'}</SubmitButton>
          {item && (
            <button type="button" onClick={() => setOpen(false)} className="btn-pill btn-pill-quiet">
              Cerrar
            </button>
          )}
        </div>
      </form>
    </Card>
  )
}
