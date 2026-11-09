export function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? parseFloat(price) : price
  return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatCm(value: string | null): string | null {
  if (value === null) return null
  const n = parseFloat(value)
  return Number.isFinite(n) ? `${Number.isInteger(n) ? n : n.toFixed(1)} cm` : null
}

export function formatAddress(address: { address_line: string; zone: string | null; municipality: { name: string }; department: { name: string } }) {
  const zone = address.zone ? `zona ${address.zone.replace(/^zona\s*/i, '')}` : null
  return [address.address_line, zone, address.municipality.name, address.department.name].filter(Boolean).join(', ')
}

export function formatBirthDate(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
