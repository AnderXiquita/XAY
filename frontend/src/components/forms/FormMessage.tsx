export default function FormMessage({ error, success }: { error?: string | undefined; success?: string | undefined }) {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg px-4 py-3"
        style={{ fontSize: '0.85rem', backgroundColor: 'rgba(160, 57, 43, 0.08)', color: 'var(--color-error)' }}
      >
        {error}
      </div>
    )
  }
  if (success) {
    return (
      <div
        role="status"
        className="rounded-lg px-4 py-3"
        style={{ fontSize: '0.85rem', backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-text-primary)' }}
      >
        {success}
      </div>
    )
  }
  return null
}
