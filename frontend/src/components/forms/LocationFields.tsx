'use client'

import { useEffect, useId, useState } from 'react'
import { getMunicipalitiesByDepartment, type Department, type Municipality } from '@/lib/api'
import { FieldShell, inputClass, selectStyle } from './Field'

interface LocationFieldsProps {
  departments: Department[]
  defaultDepartmentId?: string | undefined
  defaultMunicipalityId?: string | undefined
  departmentError?: string | undefined
  municipalityError?: string | undefined
}

export default function LocationFields({
  departments,
  defaultDepartmentId = '',
  defaultMunicipalityId = '',
  departmentError,
  municipalityError,
}: LocationFieldsProps) {
  const departmentFieldId = useId()
  const municipalityFieldId = useId()
  const [departmentId, setDepartmentId] = useState(defaultDepartmentId)
  const [municipalityId, setMunicipalityId] = useState(defaultMunicipalityId)
  // los municipios se guardan junto al departamento al que pertenecen; si no coinciden, aún están cargando
  const [loaded, setLoaded] = useState<{ departmentId: string; list: Municipality[] }>({ departmentId: '', list: [] })
  const loading = departmentId !== '' && loaded.departmentId !== departmentId
  const municipalities = loaded.departmentId === departmentId ? loaded.list : []

  useEffect(() => {
    const department = departments.find((d) => String(d.id) === departmentId)
    if (!department) return
    let cancelled = false
    getMunicipalitiesByDepartment(department.slug)
      .catch(() => [])
      .then((list) => {
        if (!cancelled) setLoaded({ departmentId, list })
      })
    return () => {
      cancelled = true
    }
  }, [departmentId, departments])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FieldShell id={departmentFieldId} label="Departamento" error={departmentError}>
        <select
          id={departmentFieldId}
          name="department_id"
          value={departmentId}
          onChange={(e) => {
            setDepartmentId(e.target.value)
            setMunicipalityId('')
          }}
          aria-invalid={Boolean(departmentError)}
          className={inputClass(departmentError)}
          style={selectStyle}
        >
          <option value="">Elige uno</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell id={municipalityFieldId} label="Municipio" error={municipalityError}>
        <select
          id={municipalityFieldId}
          name="municipality_id"
          value={municipalityId}
          onChange={(e) => setMunicipalityId(e.target.value)}
          disabled={!departmentId || loading}
          aria-invalid={Boolean(municipalityError)}
          className={inputClass(municipalityError)}
          style={selectStyle}
        >
          <option value="">{loading ? 'Cargando…' : departmentId ? 'Elige uno' : 'Primero el departamento'}</option>
          {municipalities.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </FieldShell>
    </div>
  )
}
