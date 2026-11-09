'use client'

import { useId, useState } from 'react'

export function inputClass(error?: string) {
  return `w-full rounded-lg border px-4 outline-none transition-colors duration-150 bg-[var(--color-bg)] disabled:opacity-60 ${
    error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
  }`
}

// 16px para que el iPhone no haga zoom al escribir
export const inputStyle = { minHeight: '48px', fontSize: '16px', color: 'var(--color-text-primary)' }

interface FieldShellProps {
  id: string
  label: string
  optional?: boolean | undefined
  error?: string | undefined
  hint?: string | undefined
  children: React.ReactNode
}

export function FieldShell({ id, label, optional, error, hint, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1.5" style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
        {label}
        {optional && <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}> (opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5" style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

interface FieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'date'
  multiline?: boolean
  autoComplete?: string
  placeholder?: string
  defaultValue?: string | undefined
  error?: string | undefined
  hint?: string | undefined
  optional?: boolean
  max?: string
}

export default function Field({ label, name, type = 'text', multiline, autoComplete, placeholder, defaultValue, error, hint, optional, max }: FieldProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const common = {
    id,
    name,
    autoComplete,
    placeholder,
    defaultValue,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
  }

  return (
    <FieldShell id={id} label={label} optional={optional} error={error} hint={hint}>
      <div className="relative">
        {multiline ? (
          <textarea {...common} rows={3} className={`${inputClass(error)} py-3 resize-none`} style={inputStyle} />
        ) : (
          <input
            {...common}
            type={isPassword && visible ? 'text' : type}
            max={max}
            inputMode={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
            autoCapitalize={type === 'text' ? 'sentences' : 'none'}
            spellCheck={false}
            className={`${inputClass(error)} ${isPassword ? 'pr-12' : ''}`}
            style={inputStyle}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-0 top-0 flex items-center justify-center"
            style={{ width: '48px', height: '48px', color: 'var(--color-text-muted)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              {visible && <line x1="3" y1="3" x2="21" y2="21" />}
            </svg>
          </button>
        )}
      </div>
    </FieldShell>
  )
}
