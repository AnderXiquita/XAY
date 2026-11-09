import { Router } from 'express'
import * as Users from '../controllers/users.controller.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { addressSchema, changePasswordSchema, updateProfileSchema } from '../schemas/users.schema.js'

const router = Router()

router.use(authenticate)

router.patch('/me', validate(updateProfileSchema), Users.updateProfile)
router.patch('/me/password', validate(changePasswordSchema), Users.changePassword)

router.get('/me/addresses', Users.listAddresses)
router.post('/me/addresses', validate(addressSchema), Users.createAddress)
router.patch('/me/addresses/:id', validate(addressSchema), Users.updateAddress)
router.post('/me/addresses/:id/default', Users.setDefaultAddress)
router.delete('/me/addresses/:id', Users.deleteAddress)

export default router
