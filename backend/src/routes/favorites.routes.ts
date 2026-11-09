import { Router } from 'express'
import * as Favorites from '../controllers/favorites.controller.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { mergeFavoritesSchema } from '../schemas/favorites.schema.js'

const router = Router()

router.use(authenticate)

router.get('/', Favorites.listFavorites)
router.get('/ids', Favorites.listFavoriteIds)
router.post('/merge', validate(mergeFavoritesSchema), Favorites.mergeFavorites)
router.put('/:productId', Favorites.addFavorite)
router.delete('/:productId', Favorites.removeFavorite)

export default router
