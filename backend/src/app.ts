import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler.js'
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import departmentsRoutes from './routes/departments.routes.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware base
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rutas públicas
app.use('/api/v1/products', productsRoutes)
app.use('/api/v1/categories', categoriesRoutes)
app.use('/api/v1/departments', departmentsRoutes)

// Manejo de errores (siempre al final)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`[API] Servidor corriendo en http://localhost:${PORT}`)
})

export default app
