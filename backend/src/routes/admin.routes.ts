import { Router } from 'express'
import * as Admin from '../controllers/admin.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { categorySchema, productSchema, supplierSchema, userStatusSchema } from '../schemas/admin.schema.js'

const router = Router()

router.use(authenticate, requireAdmin)

router.get('/stats', Admin.stats)

router.get('/products', Admin.listProducts)
router.get('/products/:id', Admin.getProduct)
router.post('/products', validate(productSchema), Admin.createProduct)
router.put('/products/:id', validate(productSchema), Admin.updateProduct)

router.get('/categories', Admin.listCategories)
router.post('/categories', validate(categorySchema), Admin.createCategory)
router.put('/categories/:id', validate(categorySchema), Admin.updateCategory)

router.get('/suppliers', Admin.listSuppliers)
router.post('/suppliers', validate(supplierSchema), Admin.createSupplier)
router.put('/suppliers/:id', validate(supplierSchema), Admin.updateSupplier)

router.get('/users', Admin.listUsers)
router.patch('/users/:id', validate(userStatusSchema), Admin.setUserActive)

export default router
