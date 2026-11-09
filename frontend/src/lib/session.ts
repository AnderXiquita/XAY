import { cache } from 'react'
import { cookies } from 'next/headers'
import { getMe } from './api'
import { SESSION_COOKIE } from './auth-cookie'

export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  return getMe(token)
})
