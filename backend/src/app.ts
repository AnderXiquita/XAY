import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler.js'
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import departmentsRoutes from './routes/departments.routes.js'
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/users.routes.js'
import favoritesRoutes from './routes/favorites.routes.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware base
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
// Render pone un proxy delante: así req.ip es la IP real que llega
app.set('trust proxy', 1)

app.use(express.json({ limit: '100kb' }))

// Health check — también es el endpoint que el monitor externo pinguea cada pocos
// minutos para que Render (plan free) no duerma el servicio por inactividad.
// IMPORTANTE: no consultar la base de datos aquí. Si el ping tocara la BD, Neon
// nunca se suspendería y se consumirían las horas de cómputo del plan gratuito.
// Express responde HEAD automáticamente con este mismo handler.
app.get('/api/v1/health', (_req, res) => {
  res.set('Cache-Control', 'no-store')
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.round(process.uptime()),
  })
})

// Rutas públicas
app.use('/api/v1/products', productsRoutes)
app.use('/api/v1/categories', categoriesRoutes)
app.use('/api/v1/departments', departmentsRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/favorites', favoritesRoutes)

// Manejo de errores (siempre al final)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`[API] Servidor corriendo en http://localhost:${PORT}`)
})

export default app
