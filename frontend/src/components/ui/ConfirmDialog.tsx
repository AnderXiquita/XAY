'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

type LenisWindow = Window & { __lenis?: { stop: () => void; start: () => void } }

// reemplaza a window.confirm: const [confirm, dialog] = useConfirm(); if (await confirm({...})) ...
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const close = useCallback((value: boolean) => {
    resolver.current?.(value)
    resolver.current = null
    setOptions(null)
  }, [])

  const dialog = <ConfirmDialog options={options} onClose={close} />
  return [confirm, dialog] as const
}

function ConfirmDialog({ options, onClose }: { options: ConfirmOptions | null; onClose: (value: boolean) => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const open = options !== null

  useEffect(() => {
    if (!open) return
    const lenis = (window as LenisWindow).__lenis
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!options) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4" style={{ animation: 'fadeIn 200ms ease' }}>
      <div
        className="absolute inset-0"
        onClick={() => onClose(false)}
        style={{ backgroundColor: 'rgba(9, 31, 44, 0.45)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={options.message ? 'confirm-message' : undefined}
        className="relative w-full rounded-2xl p-6 sm:p-8 shadow-xl"
        style={{ maxWidth: '420px', backgroundColor: 'var(--color-bg)', animation: 'fadeInUp 250ms ease' }}
      >
        <h2 id="confirm-title" className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          {options.title}
        </h2>
        {options.message && (
          <p id="confirm-message" className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {options.message}
          </p>
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">
          <button ref={cancelRef} type="button" onClick={() => onClose(false)} className="btn-pill btn-pill-quiet">
            {options.cancelLabel ?? 'Cancelar'}
          </button>
          <button type="button" onClick={() => onClose(true)} className={`btn-pill ${options.danger ? 'btn-pill-danger' : ''}`}>
            {options.confirmLabel ?? 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  )
}
