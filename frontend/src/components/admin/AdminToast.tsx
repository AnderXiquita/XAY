'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type ToastKind = 'success' | 'error'

interface Toast {
  id: number
  kind: ToastKind
  message: string
  leaving: boolean
}

const ToastContext = createContext<((kind: ToastKind, message: string) => void) | null>(null)

const VISIBLE_MS = 3500
const LEAVE_MS = 250

// avisos del panel ("Cambios guardados", errores): entran desde arriba y se van solos
export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), LEAVE_MS)
  }, [])

  const show = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++nextId.current
      setToasts((list) => [...list.slice(-2), { id, kind, message, leaving: false }])
      setTimeout(() => dismiss(id), VISIBLE_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="fixed z-[400] top-[72px] left-4 right-4 lg:top-6 lg:left-auto lg:right-6 lg:w-[360px] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl pl-4 pr-2 py-3 shadow-lg"
            style={{
              backgroundColor: toast.kind === 'error' ? 'var(--color-bg)' : 'var(--color-text-primary)',
              color: toast.kind === 'error' ? 'var(--color-error)' : 'var(--color-text-inverse)',
              border: toast.kind === 'error' ? '1px solid rgba(160, 57, 43, 0.35)' : 'none',
              animation: toast.leaving ? undefined : 'fadeInUp 300ms cubic-bezier(0.22, 1, 0.36, 1)',
              opacity: toast.leaving ? 0 : 1,
              transform: toast.leaving ? 'translateY(-8px)' : undefined,
              transition: `opacity ${LEAVE_MS}ms ease, transform ${LEAVE_MS}ms ease`,
            }}
          >
            <span
              className="shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: toast.kind === 'error' ? 'rgba(160, 57, 43, 0.1)' : 'rgba(255, 251, 244, 0.15)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {toast.kind === 'error' ? <path d="M12 8v5M12 16.5v.5" /> : <path d="M5 12.5l4.5 4.5L19 7.5" />}
              </svg>
            </span>
            <p className="flex-1 text-sm leading-snug">{toast.message}</p>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Cerrar aviso" className="shrink-0 flex items-center justify-center rounded-full" style={{ width: '32px', height: '32px', opacity: 0.7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useAdminToast() {
  const show = useContext(ToastContext)
  if (!show) throw new Error('useAdminToast debe usarse dentro de AdminToastProvider')
  return show
}

// muestra el aviso cada vez que una acción del formulario devuelve un resultado nuevo
export function useToastOnResult(state: { success?: string | undefined; error?: string | undefined }) {
  const show = useAdminToast()
  const shown = useRef<object | null>(null)
  useEffect(() => {
    if (shown.current === state) return
    shown.current = state
    if (state.success) show('success', state.success)
    else if (state.error) show('error', state.error)
  }, [state, show])
}
