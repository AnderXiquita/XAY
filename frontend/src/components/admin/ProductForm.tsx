'use client'

import Image from 'next/image'
import Link from 'next/link'
import { startTransition, useActionState, useState } from 'react'
import { saveProductAction, type AdminFormState } from '@/app/actions/admin'
import type { AdminCategory, AdminProduct, AdminSupplier, Department } from '@/lib/api'
import Field from '@/components/forms/Field'
import LocationFields from '@/components/forms/LocationFields'
import SelectField from '@/components/forms/SelectField'
import { Card, STATUS_LABELS } from './AdminUI'
import { useToastOnResult } from './AdminToast'

interface ProductFormProps {
  product?: AdminProduct | undefined
  categories: AdminCategory[]
  suppliers: AdminSupplier[]
  departments: Department[]
  justCreated?: boolean
  featured: { count: number; max: number }
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h2>
      {description && (
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      )}
      <div className="space-y-5 mt-5">{children}</div>
    </Card>
  )
}

function Checkbox({ name, label, hint, error, defaultChecked }: { name: string; label: string; hint?: string; error?: string | undefined; defaultChecked: boolean }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-[#091F2C] mt-1" style={{ width: '18px', height: '18px' }} />
      <span>
        <span className="block text-sm" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </span>
        {error ? (
          <span className="block text-xs mt-0.5" style={{ color: 'var(--color-error)' }}>
            {error}
          </span>
        ) : hint ? (
          <span className="block text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  )
}

const num = (value: string | null | undefined) => (value === null || value === undefined ? '' : String(Number(value)))

export default function ProductForm({ product, categories, suppliers, departments, justCreated, featured }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(saveProductAction, justCreated ? { success: 'Producto creado como borrador. Ahora puedes agregarle fotos.' } : {})
  const [traditional, setTraditional] = useState(state.values ? state.values.is_traditional !== 'false' : (product?.is_traditional ?? true))

  useToastOnResult(state)

  const error = (name: string) => state.fieldErrors?.[name]?.[0]
  const value = (name: string, fallback: string | null | undefined) => state.values?.[name] ?? fallback ?? ''
  const isChecked = (name: string, fallback: boolean) => (state.values ? state.values[name] === 'on' : fallback)

  const images = product?.images ?? []

  return (
    // se envía con onSubmit (no con action) para que React no reinicie el formulario si vuelve con errores
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => formAction(data))
      }}
    >
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="is_traditional" value={String(traditional)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-5">
          <Section title="Información básica">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-full" style={{ backgroundColor: 'var(--color-surface)' }}>
              {[
                { value: true, label: 'Prenda típica' },
                { value: false, label: 'Complemento moderno' },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setTraditional(option.value)}
                  aria-pressed={traditional === option.value}
                  className="rounded-full text-sm transition-colors"
                  style={{
                    minHeight: '40px',
                    backgroundColor: traditional === option.value ? 'var(--color-text-primary)' : 'transparent',
                    color: traditional === option.value ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Field label="Nombre" name="name" placeholder="Güipil de Sololá con flores rojas" defaultValue={value('name', product?.name)} error={error('name')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SelectField
                label="Categoría"
                name="category_id"
                placeholder="Elige una"
                options={categories.map((c) => ({ value: String(c.id), label: c.is_active ? c.name : `${c.name} (inactiva)` }))}
                defaultValue={value('category_id', product ? String(product.category_id) : '')}
                error={error('category_id')}
              />
              <Field label="Precio (Q)" name="price" type="number" step="0.01" placeholder="850.00" defaultValue={value('price', num(product?.price))} error={error('price')} />
            </div>
            {!traditional && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Unidades en stock" name="quantity" type="number" step="1" defaultValue={value('quantity', String(product?.quantity ?? 1))} error={error('quantity')} />
                <SelectField
                  label="Proveedor"
                  name="supplier_id"
                  optional
                  placeholder="Sin proveedor"
                  options={suppliers.map((s) => ({ value: String(s.id), label: s.name }))}
                  defaultValue={value('supplier_id', product?.supplier_id ? String(product.supplier_id) : '')}
                  error={error('supplier_id')}
                />
              </div>
            )}
            <Field
              label="Dirección en la tienda"
              name="slug"
              optional
              placeholder="se genera del nombre"
              defaultValue={value('slug', product?.slug)}
              error={error('slug')}
              hint={product ? `xay-mu.vercel.app/tienda/${product.slug}` : 'Si lo dejas vacío se arma con el nombre'}
            />
          </Section>

          {traditional && (
            <Section title="Origen" description="Departamento y municipio donde se tejió la pieza. Obligatorio para publicarla.">
              <LocationFields
                departments={departments}
                defaultDepartmentId={value('department_id', product?.department ? String(product.department.id) : '')}
                defaultMunicipalityId={value('municipality_id', product?.municipality_id ? String(product.municipality_id) : '')}
                municipalityError={error('municipality_id')}
              />
            </Section>
          )}

          <Section title="Medidas" description="La ropa típica no usa tallas estándar: se muestran las medidas reales de la pieza.">
            <div className="grid grid-cols-2 gap-5">
              <Field label="Ancho (cm)" name="width_cm" type="number" step="0.5" optional defaultValue={value('width_cm', num(product?.width_cm))} error={error('width_cm')} />
              <Field label="Largo (cm)" name="length_cm" type="number" step="0.5" optional defaultValue={value('length_cm', num(product?.length_cm))} error={error('length_cm')} />
            </div>
            <Field label="Talla" name="size_label" optional placeholder="M/L, Talla única" defaultValue={value('size_label', product?.size_label)} error={error('size_label')} />
            <Field label="Nota de ajuste" name="size_notes" optional placeholder="Holgado; queda bien de S a L" defaultValue={value('size_notes', product?.size_notes)} error={error('size_notes')} />
          </Section>

          <Section title="Tela y bordado">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Tipo de tela" name="fabric_type" optional placeholder="Algodón, jaspe…" defaultValue={value('fabric_type', product?.fabric_type)} error={error('fabric_type')} />
              <SelectField
                label="Bordado"
                name="embroidery_type"
                optional
                placeholder="Sin especificar"
                options={[
                  { value: 'hand', label: 'A mano' },
                  { value: 'machine', label: 'A máquina' },
                  { value: 'mixed', label: 'Mixto' },
                ]}
                defaultValue={value('embroidery_type', product?.embroidery_type)}
                error={error('embroidery_type')}
              />
            </div>
            <Field
              label="Colores principales"
              name="colors"
              optional
              placeholder="rojo, azul, blanco"
              defaultValue={value('colors', product?.colors.join(', '))}
              error={error('colors')}
              hint="Separados por coma. Se usan en los filtros de la tienda."
            />
          </Section>

          <Section title="Historia de la pieza" description="Lo que la hace especial: dónde se usa, qué significan sus figuras, quién la tejió.">
            <Field label="Descripción" name="description" multiline rows={7} optional defaultValue={value('description', product?.description)} error={error('description')} />
          </Section>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6">
          <Section title="Publicación">
            <SelectField
              label="Estado"
              name="status"
              options={(['draft', 'available', 'coming_soon', 'sold'] as const).map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
              defaultValue={value('status', product?.status ?? 'draft')}
              error={error('status')}
              hint="Los borradores no se ven en la tienda."
            />
            <Checkbox
              name="is_featured"
              label="Destacar en la página de inicio"
              hint={`${featured.count} de ${featured.max} piezas destacadas`}
              error={error('is_featured')}
              defaultChecked={isChecked('is_featured', product?.is_featured ?? false)}
            />
            <Checkbox
              name="allow_similar_request"
              label="Permitir “solicitar similar”"
              hint="Cuando se venda, la gente puede pedir una pieza parecida."
              defaultChecked={isChecked('allow_similar_request', product?.allow_similar_request ?? true)}
            />
            <button type="submit" disabled={pending} className="btn-pill w-full">
              {pending ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
            </button>
            {product && product.status !== 'draft' && (
              <Link href={`/tienda/${product.slug}`} target="_blank" className="block text-center text-sm animated-underline mx-auto w-fit" style={{ color: 'var(--color-text-secondary)' }}>
                Ver en la tienda ↗
              </Link>
            )}
          </Section>

          <Section title="Fotos y video" description="Para publicar se necesita al menos una foto.">
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img) => (
                  <div key={img.id} className="relative overflow-hidden" style={{ aspectRatio: '3 / 4', borderRadius: '4px', backgroundColor: 'var(--color-surface)' }}>
                    {img.media_type === 'image' ? (
                      <Image src={img.url} alt="" fill sizes="200px" loading="eager" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Video
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Aún no tiene fotos.
              </p>
            )}
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {product ? 'La subida de fotos se activa cuando conectemos Cloudinary.' : 'Primero crea el producto; después podrás agregarle fotos.'}
            </p>
          </Section>
        </div>
      </div>
    </form>
  )
}
