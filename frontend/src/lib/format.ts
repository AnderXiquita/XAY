export function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? parseFloat(price) : price
  return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatCm(value: string | null): string | null {
  if (value === null) return null
  const n = parseFloat(value)
  return Number.isFinite(n) ? `${Number.isInteger(n) ? n : n.toFixed(1)} cm` : null
}
