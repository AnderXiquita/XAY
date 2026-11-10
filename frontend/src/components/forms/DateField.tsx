'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { FieldShell, inputClass } from './Field'
import Dropdown from './Dropdown'

interface DateFieldProps {
  label: string
  name: string
  defaultValue?: string | undefined // yyyy-mm-dd
  error?: string | undefined
  hint?: string | undefined
  optional?: boolean
  minYear?: number
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

function parse(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match ? { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) } : null
}

function todayParts() {
  const now = new Date()
  return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() }
}

// calendario propio para la fecha de nacimiento: se elige mes y año rápido y no deja fechas futuras
export default function DateField({ label, name, defaultValue = '', error, hint, optional, minYear = 1920 }: DateFieldProps) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  // el calendario depende de "hoy": se dibuja solo en el navegador, la primera vez que se abre
  const [ready, setReady] = useState(false)
  const selected = parse(value)
  const [view, setView] = useState(() => {
    const base = selected ?? { y: 1995, m: 0 }
    return { y: base.y, m: base.m }
  })
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const today = ready ? todayParts() : { y: minYear, m: 0, d: 1 }
  const years = Array.from({ length: today.y - minYear + 1 }, (_, i) => today.y - i)
  const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const isFuture = (d: number) => view.y > today.y || (view.y === today.y && (view.m > today.m || (view.m === today.m && d > today.d)))
  const canGoNext = view.y < today.y || (view.y === today.y && view.m < today.m)

  function shift(delta: number) {
    setView((v) => {
      const date = new Date(v.y, v.m + delta, 1)
      return { y: date.getFullYear(), m: date.getMonth() }
    })
  }

  function openCalendar() {
    if (selected) setView({ y: selected.y, m: selected.m })
    setReady(true)
    setOpen((o) => !o)
  }

  const display = selected ? `${selected.d} de ${MONTHS[selected.m]} de ${selected.y}` : ''

  return (
    <FieldShell id={id} label={label} optional={optional} error={error} hint={hint}>
      <div ref={rootRef} className="relative">
        <input type="hidden" name={name} value={value} />
        <button
          id={id}
          type="button"
          onClick={openCalendar}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`${inputClass(error)} flex items-center justify-between gap-2 text-left`}
          style={{ minHeight: '48px', fontSize: '16px', color: display ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
        >
          <span>{display || 'Elige una fecha'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
          </svg>
        </button>

        <div
          role="dialog"
          aria-label="Elegir fecha"
          className="absolute left-0 z-40 p-4"
          style={{
            top: 'calc(100% + 6px)',
            width: 'min(320px, 100%)',
            minWidth: '280px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-bg)',
            boxShadow: '0 12px 36px rgba(9, 31, 44, 0.16)',
            border: '1px solid var(--color-border)',
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(-6px)',
            pointerEvents: open ? 'auto' : 'none',
            visibility: open ? 'visible' : 'hidden',
            transition: 'opacity 200ms ease, transform 200ms ease, visibility 200ms',
          }}
        >
          {ready && (
          <>
          <div className="flex items-center gap-2 mb-3">
            <button type="button" onClick={() => shift(-1)} aria-label="Mes anterior" className="shrink-0 flex items-center justify-center rounded-full hover:bg-[var(--color-surface)]" style={{ width: '36px', height: '36px', color: 'var(--color-text-primary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="flex-1 grid grid-cols-[1.3fr_1fr] gap-2">
              <Dropdown size="sm" value={String(view.m)} onChange={(m) => setView((v) => ({ ...v, m: Number(m) }))} options={MONTHS.map((name, i) => ({ value: String(i), label: name.charAt(0).toUpperCase() + name.slice(1) }))} />
              <Dropdown size="sm" value={String(view.y)} onChange={(y) => setView((v) => ({ ...v, y: Number(y) }))} options={years.map((y) => ({ value: String(y), label: String(y) }))} />
            </div>
            <button
              type="button"
              onClick={() => shift(1)}
              disabled={!canGoNext}
              aria-label="Mes siguiente"
              className="shrink-0 flex items-center justify-center rounded-full hover:bg-[var(--color-surface)] disabled:opacity-30"
              style={{ width: '36px', height: '36px', color: 'var(--color-text-primary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {WEEKDAYS.map((w, i) => (
              <span key={i} className="text-[11px] uppercase py-1" style={{ color: 'var(--color-text-muted)' }}>
                {w}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {Array.from({ length: firstWeekday }, (_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const isSelected = selected?.y === view.y && selected.m === view.m && selected.d === day
              const isToday = today.y === view.y && today.m === view.m && today.d === day
              const future = isFuture(day)
              return (
                <button
                  key={day}
                  type="button"
                  disabled={future}
                  onClick={() => {
                    setValue(toIso(view.y, view.m, day))
                    setOpen(false)
                  }}
                  aria-pressed={isSelected}
                  className="mx-auto flex items-center justify-center rounded-full text-sm transition-colors disabled:opacity-25 enabled:hover:bg-[var(--color-surface)]"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: isSelected ? 'var(--color-text-primary)' : undefined,
                    color: isSelected ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                    boxShadow: isToday && !isSelected ? 'inset 0 0 0 1px var(--color-border)' : undefined,
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {value && (
            <div className="flex justify-end mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => {
                  setValue('')
                  setOpen(false)
                }}
                className="text-xs animated-underline"
                style={{ color: 'var(--color-text-muted)', minHeight: '32px' }}
              >
                Borrar fecha
              </button>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </FieldShell>
  )
}
