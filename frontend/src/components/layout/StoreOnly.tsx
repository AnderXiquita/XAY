'use client'

import { usePathname } from 'next/navigation'

// el panel de admin tiene su propio diseño: ahí no se muestran header, footer ni barra inferior de la tienda
export default function StoreOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return children
}
