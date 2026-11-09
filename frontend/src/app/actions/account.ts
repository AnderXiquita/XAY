'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  changePasswordRequest,
  createAddressRequest,
  deleteAddressRequest,
  setDefaultAddressRequest,
  updateAddressRequest,
  updateProfileRequest,
  type AddressFormInput,
  type ApiResult,
} from '@/lib/api'
import { getSession, getToken } from '@/lib/session'
import { PROFILE_COOKIE, SESSION_COOKIE, SESSION_MAX_AGE, initialOf, safeNext } from '@/lib/auth-cookie'

export interface FormState {
  error?: string
  fieldErrors?: Record<string, string[]>
  values?: Record<string, string>
  success?: string
}

function field(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

async function requireToken() {
  const token = await getToken()
  if (!token) redirect('/ingresar?next=/cuenta')
  return token
}

// token vencido o inválido: se limpia todo para que el header no siga mostrando la inicial
async function failure(result: Extract<ApiResult<unknown>, { ok: false }>, values: Record<string, string>): Promise<FormState> {
  if (result.status === 401) {
    const store = await cookies()
    store.delete(SESSION_COOKIE)
    store.delete(PROFILE_COOKIE)
    redirect('/ingresar?next=/cuenta')
  }
  const { details, error } = result.error
  return details ? { fieldErrors: details, values } : { error, values }
}

function readAddress(formData: FormData): AddressFormInput {
  return {
    label: field(formData, 'label'),
    recipient_name: field(formData, 'recipient_name'),
    phone: field(formData, 'phone'),
    department_id: field(formData, 'department_id'),
    municipality_id: field(formData, 'municipality_id'),
    zone: field(formData, 'zone'),
    address_line: field(formData, 'address_line'),
    reference: field(formData, 'reference'),
    is_default: formData.get('is_default') === 'on',
  }
}

function asValues(input: AddressFormInput): Record<string, string> {
  const { is_default, ...rest } = input
  return { ...rest, is_default: is_default ? 'on' : '' }
}

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = await requireToken()
  const values = { name: field(formData, 'name'), phone: field(formData, 'phone'), birth_date: field(formData, 'birth_date') }
  const result = await updateProfileRequest(token, values)
  if (!result.ok) return failure(result, values)

  ;(await cookies()).set(PROFILE_COOKIE, initialOf(result.data.name), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  revalidatePath('/cuenta', 'layout')
  return { success: 'Tus datos se guardaron', values }
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = await requireToken()
  const newPassword = field(formData, 'new_password')
  if (newPassword !== field(formData, 'confirm_password')) {
    return { fieldErrors: { confirm_password: ['Las contraseñas no coinciden'] } }
  }

  const result = await changePasswordRequest(token, { current_password: field(formData, 'current_password'), new_password: newPassword })
  if (!result.ok) return failure(result, {})
  return { success: 'Tu contraseña se cambió' }
}

export async function saveAddressAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = await requireToken()
  const id = field(formData, 'id')
  const input = readAddress(formData)
  const result = id ? await updateAddressRequest(token, id, input) : await createAddressRequest(token, input)
  if (!result.ok) return failure(result, asValues(input))

  revalidatePath('/cuenta', 'layout')
  redirect('/cuenta/direcciones')
}

export async function deleteAddressAction(formData: FormData) {
  const token = await requireToken()
  await deleteAddressRequest(token, field(formData, 'id'))
  revalidatePath('/cuenta', 'layout')
}

export async function setDefaultAddressAction(formData: FormData) {
  const token = await requireToken()
  await setDefaultAddressRequest(token, field(formData, 'id'))
  revalidatePath('/cuenta', 'layout')
}

// paso "completa tu perfil": todo es opcional, pero si empieza una dirección la tiene que terminar
export async function completeProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = await requireToken()
  const user = await getSession()
  if (!user) redirect('/ingresar')

  const next = safeNext(formData.get('next'))
  const phone = field(formData, 'phone')
  const birthDate = field(formData, 'birth_date')
  const address = { ...readAddress(formData), label: 'Casa', recipient_name: user.name, phone, is_default: false }
  const values = { ...asValues(address), phone, birth_date: birthDate }
  const wantsAddress = [address.department_id, address.municipality_id, address.zone, address.address_line, address.reference].some(Boolean)

  if (wantsAddress && !phone) {
    return { fieldErrors: { phone: ['Lo necesitamos para coordinar la entrega'] }, values }
  }

  const profile = await updateProfileRequest(token, { name: user.name, phone, birth_date: birthDate })
  if (!profile.ok) return failure(profile, values)

  if (wantsAddress) {
    const created = await createAddressRequest(token, address)
    if (!created.ok) return failure(created, values)
  }

  revalidatePath('/cuenta', 'layout')
  redirect(next)
}
