'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  children: React.ReactNode
  pendingText: string
  className?: string
}

export default function SubmitButton({ children, pendingText, className = '' }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={`btn-pill ${className}`}>
      {pending ? pendingText : children}
    </button>
  )
}
