import { Request, Response, NextFunction } from 'express'
import * as DepartmentService from '../services/departments.service.js'

export async function getDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    const departments = await DepartmentService.getDepartments()
    res.json({ data: departments })
  } catch (error) {
    next(error)
  }
}

export async function getDepartmentBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const department = await DepartmentService.getDepartmentWithMunicipalities(String(req.params['slug'] ?? ''))
    if (!department) {
      res.status(404).json({ error: 'Departamento no encontrado', code: 'DEPARTMENT_NOT_FOUND' })
      return
    }
    res.json({ data: department })
  } catch (error) {
    next(error)
  }
}
