'use client'

import { useId } from 'react'
import { FieldShell, inputClass, selectStyle } from './Field'

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
  return (
    <FieldShell id={id} label={label} optional={optional} error={error} hint={hint}>
      <select id={id} name={name} defaultValue={defaultValue ?? ''} aria-invalid={Boolean(error)} className={inputClass(error)} style={selectStyle}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
