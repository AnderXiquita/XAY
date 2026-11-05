import { Router } from 'express'
import { getProducts, getProductBySlug, getRelatedProducts } from '../controllers/products.controller.js'

const router = Router()

router.get('/', getProducts)
router.get('/:slug', getProductBySlug)
router.get('/:slug/related', getRelatedProducts)

export default router
