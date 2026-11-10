import { Router } from 'express'
import * as Cart from '../controllers/cart.controller.js'
import { cartIdentity } from '../middleware/cartIdentity.js'
import { validate } from '../middleware/validate.js'
import { addCartItemSchema, updateCartItemSchema } from '../schemas/cart.schema.js'

const router = Router()

router.use(cartIdentity)

router.get('/', Cart.getCart)
router.post('/items', validate(addCartItemSchema), Cart.addItem)
router.patch('/items/:productId', validate(updateCartItemSchema), Cart.updateItem)
router.delete('/items/:productId', Cart.removeItem)
router.post('/merge', Cart.mergeCart)

export default router
