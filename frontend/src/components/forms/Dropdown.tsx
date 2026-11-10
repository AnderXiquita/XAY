'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { inputClass } from './Field'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  name?: string
  options: DropdownOption[]
  value?: string
  defaultValue?: string | undefined
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string | undefined
  id?: string
  size?: 'md' | 'sm'
}

// mismo diseño que el filtro de departamento de la tienda; reemplaza al <select> del navegador
export default function Dropdown({ name, options, value, defaultValue = '', onChange, placeholder = 'Elige uno', disabled, error, id, size = 'md' }: DropdownProps) {
  const [inner, setInner] = useState(defaultValue)
  const selected = value ?? inner
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = options.find((o) => o.value === selected)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // al abrir, la lista se desplaza hasta la opción elegida
  useEffect(() => {
    if (!open || active < 0) return
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  function choose(next: string) {
    if (value === undefined) setInner(next)
    onChange?.(next)
    setOpen(false)
  }

  function toggle() {
    if (disabled) return
    setActive(Math.max(0, options.findIndex((o) => o.value === selected)))
    setOpen((o) => !o)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      toggle()
      return
    }
    if (!open) return
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const option = options[active]
      if (option) choose(option.value)
    } else if (e.key === 'Tab') {
      setOpen(false)
    } else if (e.key.length === 1) {
      // escribir una letra salta a la primera opción que empieza así
      const index = options.findIndex((o) => o.label.toLocaleLowerCase('es').startsWith(e.key.toLocaleLowerCase('es')))
      if (index >= 0) setActive(index)
    }
  }

  const small = size === 'sm'

  return (
    <div ref={rootRef} className="relative">
      {name && <input type="hidden" name={name} value={selected} />}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={`${small ? 'w-full rounded-lg border px-3 outline-none transition-colors bg-[var(--color-bg)] border-[var(--color-border)] focus:border-[var(--color-accent)]' : inputClass(error)} flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed`}
        style={{ minHeight: small ? '36px' : '48px', fontSize: small ? '0.875rem' : '16px', color: current ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
      >
        <span className="truncate">{current?.label ?? placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0, color: 'var(--color-text-muted)', transition: 'transform 250ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        ref={listRef}
        id={listId}
        role="listbox"
        data-lenis-prevent
        className="absolute left-0 w-full z-40 py-1 overflow-y-auto scrollbar-thin-dropdown"
        style={{
          top: 'calc(100% + 4px)',
          maxHeight: small ? '200px' : '260px',
          minWidth: small ? '120px' : undefined,
          borderRadius: '8px',
          backgroundColor: 'var(--color-bg)',
          boxShadow: '0 8px 30px rgba(9, 31, 44, 0.14)',
          border: '1px solid var(--color-border)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          pointerEvents: open ? 'auto' : 'none',
          visibility: open ? 'visible' : 'hidden',
          transition: 'opacity 200ms ease, transform 200ms ease, visibility 200ms',
        }}
      >
        {options.map((option, index) => {
          const isSelected = option.value === selected
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              data-index={index}
              tabIndex={-1}
              onClick={() => choose(option.value)}
              onMouseEnter={() => setActive(index)}
              className="w-full text-left px-4"
              style={{
                minHeight: small ? '36px' : '42px',
                fontSize: '0.875rem',
                color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: isSelected ? 500 : 400,
                backgroundColor: index === active ? 'var(--color-surface)' : 'transparent',
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
