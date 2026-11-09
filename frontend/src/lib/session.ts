import { cache } from 'react'
import { cookies } from 'next/headers'
import { getMe } from './api'
import { SESSION_COOKIE } from './auth-cookie'

export async function getToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null
}

export const getSession = cache(async () => {
  const token = await getToken()
  if (!token) return null
  return getMe(token)
})
