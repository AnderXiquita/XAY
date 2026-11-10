'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { saveAdminCategory, saveAdminProduct, saveAdminSupplier, setAdminUserActive, type ApiResult } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'

export interface AdminFormState {
  error?: string
  fieldErrors?: Record<string, string[]>
  values?: Record<string, string>
  success?: string
}

const text = (formData: FormData, name: string) => {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}
const checked = (formData: FormData, name: string) => formData.get(name) === 'on'

function failure(result: Extract<ApiResult<unknown>, { ok: false }>, values: Record<string, string>): AdminFormState {
  if (result.status === 401) redirect('/ingresar?next=/admin')
  const { details, error } = result.error
  return details ? { error: 'Revisa los campos marcados', fieldErrors: details, values } : { error, values }
}

// lo que cambia en el panel se ve en la tienda sin esperar el caché de 60 s
function refreshStore() {
  revalidatePath('/', 'layout')
}

export async function saveProductAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const token = await requireAdminToken()
  const id = text(formData, 'id') || null
  const values = Object.fromEntries([...formData.entries()].filter((e): e is [string, string] => typeof e[1] === 'string'))

  const body = {
    name: text(formData, 'name'),
    slug: text(formData, 'slug'),
    description: text(formData, 'description'),
    price: text(formData, 'price'),
    category_id: text(formData, 'category_id'),
    municipality_id: text(formData, 'municipality_id'),
    supplier_id: text(formData, 'supplier_id'),
    is_traditional: text(formData, 'is_traditional') !== 'false',
    status: text(formData, 'status'),
    width_cm: text(formData, 'width_cm'),
    length_cm: text(formData, 'length_cm'),
    size_label: text(formData, 'size_label'),
    size_notes: text(formData, 'size_notes'),
    fabric_type: text(formData, 'fabric_type'),
    embroidery_type: text(formData, 'embroidery_type'),
    colors: text(formData, 'colors')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean),
    is_featured: checked(formData, 'is_featured'),
    allow_similar_request: checked(formData, 'allow_similar_request'),
    quantity: text(formData, 'quantity') || '1',
  }

  const result = await saveAdminProduct(token, id, body)
  if (!result.ok) return failure(result, values)

  refreshStore()
  if (!id) redirect(`/admin/productos/${result.data.id}?nuevo=1`)
  return { success: 'Cambios guardados' }
}

export async function saveCategoryAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const token = await requireAdminToken()
  const id = Number(text(formData, 'id')) || null
  const values = { name: text(formData, 'name'), description: text(formData, 'description'), is_active: checked(formData, 'is_active') ? 'on' : '' }
  const result = await saveAdminCategory(token, id, { name: values.name, description: values.description, is_active: checked(formData, 'is_active') })
  if (!result.ok) return failure(result, values)
  refreshStore()
  revalidatePath('/admin/categorias')
  return { success: id ? 'Categoría actualizada' : 'Categoría creada' }
}

export async function saveSupplierAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const token = await requireAdminToken()
  const id = Number(text(formData, 'id')) || null
  const fields = ['name', 'contact_name', 'email', 'phone', 'notes'] as const
  const values: Record<string, string> = Object.fromEntries(fields.map((f) => [f, text(formData, f)]))
  const result = await saveAdminSupplier(token, id, { ...values, is_active: checked(formData, 'is_active') })
  if (!result.ok) return failure(result, { ...values, is_active: checked(formData, 'is_active') ? 'on' : '' })
  revalidatePath('/admin/proveedores')
  return { success: id ? 'Proveedor actualizado' : 'Proveedor creado' }
}

export async function setUserActiveAction(userId: string, isActive: boolean): Promise<{ error?: string }> {
  const token = await requireAdminToken()
  const result = await setAdminUserActive(token, userId, isActive)
  if (!result.ok) return { error: result.error.error }
  revalidatePath('/admin/usuarios')
  return {}
}
