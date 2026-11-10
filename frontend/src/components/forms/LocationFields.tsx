'use client'

import { useEffect, useId, useState } from 'react'
import { getMunicipalitiesByDepartment, type Department, type Municipality } from '@/lib/api'
import { FieldShell } from './Field'
import Dropdown from './Dropdown'

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
        <Dropdown
          id={departmentFieldId}
          name="department_id"
          value={departmentId}
          onChange={(next) => {
            setDepartmentId(next)
            setMunicipalityId('')
          }}
          options={departments.map((d) => ({ value: String(d.id), label: d.name }))}
          error={departmentError}
        />
      </FieldShell>

      <FieldShell id={municipalityFieldId} label="Municipio" error={municipalityError}>
        <Dropdown
          id={municipalityFieldId}
          name="municipality_id"
          value={municipalityId}
          onChange={setMunicipalityId}
          disabled={!departmentId || loading}
          placeholder={loading ? 'Cargando…' : departmentId ? 'Elige uno' : 'Primero el departamento'}
          options={municipalities.map((m) => ({ value: String(m.id), label: m.name }))}
          error={municipalityError}
        />
      </FieldShell>
    </div>
  )
}
