'use client'

import { useEffect, useId, useState } from 'react'
import { getMunicipalitiesByDepartment, type Department, type Municipality } from '@/lib/api'
import { FieldShell, inputClass, inputStyle } from './Field'

interface LocationFieldsProps {
  departments: Department[]
  defaultDepartmentId?: string | undefined
  defaultMunicipalityId?: string | undefined
  departmentError?: string | undefined
  municipalityError?: string | undefined
}

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A7080' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const selectStyle = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: chevron,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: '40px',
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
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const department = departments.find((d) => String(d.id) === departmentId)
    if (!department) {
      setMunicipalities([])
      return
    }
    let cancelled = false
    setLoading(true)
    getMunicipalitiesByDepartment(department.slug)
      .then((list) => {
        if (!cancelled) setMunicipalities(list)
      })
      .catch(() => {
        if (!cancelled) setMunicipalities([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
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
