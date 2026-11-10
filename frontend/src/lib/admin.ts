import { redirect } from 'next/navigation'
import { getToken } from './session'

// para server components y server actions del panel; el backend vuelve a revisar que sea admin
export async function requireAdminToken() {
  const token = await getToken()
  if (!token) redirect('/ingresar?next=/admin')
  return token
}
