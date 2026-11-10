'use client'

import { useId } from 'react'
import { FieldShell } from './Field'
import Dropdown from './Dropdown'

interface SelectFieldProps {
  label: string
  name: string
  options: { value: string; label: string }[]
  defaultValue?: string | undefined
  placeholder?: string
  error?: string | undefined
  hint?: string | undefined
  optional?: boolean
}

export default function SelectField({ label, name, options, defaultValue, placeholder, error, hint, optional }: SelectFieldProps) {
  const id = useId()
  // con placeholder la primera opción es "ninguna" (valor vacío)
  const list = placeholder !== undefined ? [{ value: '', label: placeholder }, ...options] : options
  return (
    <FieldShell id={id} label={label} optional={optional} error={error} hint={hint}>
      <Dropdown id={id} name={name} options={list} defaultValue={defaultValue ?? ''} placeholder={placeholder} error={error} />
    </FieldShell>
  )
}
