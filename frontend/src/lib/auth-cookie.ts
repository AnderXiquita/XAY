export const SESSION_COOKIE = 'xay_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

// solo rutas internas, para que nadie pueda mandar a otro sitio con ?next=https://...
export function safeNext(value: unknown, fallback = '/cuenta'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}

// cookie visible para el navegador, solo para pintar la inicial en el header; no da acceso a nada
export const PROFILE_COOKIE = 'xay_profile'

export function initialOf(name: string) {
  return (Array.from(name.trim())[0] ?? '').toLocaleUpperCase('es')
}
