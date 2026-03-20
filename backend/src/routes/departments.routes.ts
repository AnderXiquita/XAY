import { Router } from 'express'
import { getDepartments, getDepartmentBySlug } from '../controllers/departments.controller.js'

const router = Router()

router.get('/', getDepartments)
router.get('/:slug', getDepartmentBySlug)

export default router
