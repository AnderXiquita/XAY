export const SESSION_COOKIE = 'xay_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

// solo rutas internas, para que nadie pueda mandar a otro sitio con ?next=https://...
export function safeNext(value: unknown, fallback = '/cuenta'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}
