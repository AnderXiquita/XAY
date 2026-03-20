# Tipical Store — Architecture & Code Best Practices Skill

Lee este archivo antes de escribir cualquier código de backend o de lógica de negocio. Define cómo está organizado el proyecto, qué convenciones seguimos y por qué. El objetivo es que en 6 meses cualquiera de los dos desarrolladores del equipo pueda abrir un archivo y entender qué hace sin necesidad de preguntar.

---

## Filosofía general

**El código se escribe para ser leído, no solo para funcionar.** Un sistema que funciona pero que nadie entiende es una deuda técnica. En este proyecto el desarrollador principal está aprendiendo mientras construye, así que cada decisión debe poder explicarse. Si no puedes explicar por qué hiciste algo de cierta forma, probablemente hay una forma más clara.

**Ir despacio para ir rápido.** No saltar pasos. No construir la feature siguiente hasta que la anterior funcione, esté entendida y sea mantenible. Un bloque sólido es mejor que tres bloques frágiles.

**Separación de responsabilidades.** Cada archivo, función y módulo tiene una sola razón para existir. Si una función hace dos cosas, es candidata a dividirse.

---

## Estructura de carpetas

### Backend (`/backend/src/`)

```
backend/
└── src/
    ├── routes/          # Solo define rutas y conecta con controllers. Sin lógica.
    ├── controllers/     # Recibe la request, llama al service, devuelve la response. Sin lógica de negocio.
    ├── services/        # Aquí vive toda la lógica de negocio. Es el corazón del backend.
    ├── middleware/      # Auth, validación, manejo de errores, logging.
    ├── prisma/          # Schema de Prisma y migraciones.
    ├── lib/             # Clientes externos (Cloudinary, email, etc.) y utilidades compartidas.
    ├── types/           # Tipos TypeScript específicos del backend.
    └── app.ts           # Configuración de Express. Sin lógica de negocio.
```

### Frontend (`/frontend/`)

```
frontend/
└── app/                    # App Router de Next.js
    ├── (store)/            # Rutas públicas de la tienda
    │   ├── page.tsx        # Home
    │   ├── catalog/
    │   ├── products/[slug]/
    │   └── ...
    ├── (auth)/             # Rutas de autenticación
    ├── (account)/          # Rutas del usuario autenticado
    ├── admin/              # Panel de administrador (protegido)
    └── api/                # Route handlers de Next.js si se necesitan

components/
    ├── ui/                 # Componentes base reutilizables (Button, Input, Card, etc.)
    ├── store/              # Componentes específicos de la tienda (ProductCard, CartDrawer, etc.)
    ├── admin/              # Componentes del panel admin
    └── layout/             # Header, Footer, Sidebar, etc.

lib/
    ├── api.ts              # Cliente HTTP para llamar al backend
    ├── auth.ts             # Helpers de autenticación
    └── utils.ts            # Utilidades generales

hooks/                      # Custom hooks de React
types/                      # Tipos TypeScript del frontend
```

---

## La regla de las tres capas (backend)

Esta es la regla más importante del backend. Cada request pasa por exactamente tres capas y cada capa tiene una responsabilidad única.

```
Request → Route → Controller → Service → Database
                                        ↑
                              Toda la lógica vive aquí
```

### Route — solo define el endpoint
```typescript
// routes/products.ts
import { Router } from 'express'
import { getProducts, getProductBySlug } from '../controllers/products.controller'
import { authenticate, requireAdmin } from '../middleware/auth'

const router = Router()

router.get('/', getProducts)
router.get('/:slug', getProductBySlug)
router.post('/', authenticate, requireAdmin, createProduct) // protegida

export default router
```

### Controller — solo orquesta
```typescript
// controllers/products.controller.ts
import { Request, Response, NextFunction } from 'express'
import * as ProductService from '../services/products.service'

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = req.query // pasar filters tal cual al service
    const products = await ProductService.getProducts(filters)
    res.json({ data: products })
  } catch (error) {
    next(error) // siempre delegar errores al middleware de errores
  }
}
```

**El controller NO debe:**
- Hacer queries a la base de datos directamente
- Tener lógica de negocio (if/else complejos, cálculos)
- Conocer detalles de Prisma

### Service — aquí vive todo lo importante
```typescript
// services/products.service.ts
import { prisma } from '../lib/prisma'
import type { ProductFilters } from '../types/products'

export async function getProducts(filters: ProductFilters) {
  // Aquí sí hay lógica: filtros, transformaciones, validaciones de negocio
  const where = buildProductWhereClause(filters)

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { position: 'asc' } },
      municipality: { include: { department: true } },
      category: true,
    },
    orderBy: { created_at: 'desc' },
  })

  return products
}

// Las funciones auxiliares también van en el service
function buildProductWhereClause(filters: ProductFilters) {
  // lógica de construcción de filtros...
}
```

---

## Manejo de errores

### En el backend: siempre con estructura consistente

Crear una clase `AppError` para errores controlados:

```typescript
// lib/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
  }
}
```

Middleware de errores global (registrado al final de app.ts):

```typescript
// middleware/errorHandler.ts
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    })
  }

  // Error no controlado — loggear y responder genérico
  console.error(err)
  res.status(500).json({
    error: 'Error interno del servidor',
    code: 'INTERNAL_ERROR',
  })
}
```

Uso en services:
```typescript
import { AppError } from '../lib/AppError'

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } })

  if (!product) {
    throw new AppError('Producto no encontrado', 404, 'PRODUCT_NOT_FOUND')
  }

  return product
}
```

### En el frontend: nunca dejar errores silenciosos

```typescript
// Siempre mostrar feedback al usuario cuando algo falla
try {
  await addToCart(productId)
  toast.success('Agregado al carrito')
} catch (error) {
  toast.error('No se pudo agregar al carrito. Intenta de nuevo.')
  // NO: console.log(error) y seguir como si nada
}
```

---

## Convenciones de nombrado

### Archivos
- Componentes React: `PascalCase.tsx` → `ProductCard.tsx`
- Servicios, controllers, routes: `kebab-case.tipo.ts` → `products.service.ts`, `products.controller.ts`
- Hooks: `camelCase.ts` empezando con `use` → `useCart.ts`
- Tipos: `PascalCase.ts` o junto al archivo que los usa
- Constantes: `UPPER_SNAKE_CASE` → `MAX_CART_ITEMS`

### Variables y funciones
- Variables y funciones: `camelCase`
- Clases: `PascalCase`
- Tipos e interfaces TypeScript: `PascalCase`
- Interfaces con prefijo `I` solo si hay ambigüedad con una clase del mismo nombre
- Booleanos: empezar con `is`, `has`, `can`, `should` → `isAvailable`, `hasStock`, `canCheckout`
- Funciones que retornan JSX: `PascalCase` (son componentes)
- Event handlers: prefijo `handle` → `handleAddToCart`, `handleFormSubmit`

### Base de datos (Prisma)
- Tablas: `PascalCase` singular → `Product`, `OrderItem`, `Municipality`
- Columnas: `snake_case` → `created_at`, `is_featured`, `municipality_id`
- Relaciones en Prisma schema: `camelCase` → `orderItems`, `productImages`

---

## TypeScript: reglas no negociables

**Nunca usar `any`.** Si no sabes el tipo, usa `unknown` y luego narrowing, o define el tipo correctamente.

```typescript
// Mal
function processOrder(order: any) { ... }

// Bien
function processOrder(order: Order) { ... }

// Bien si el tipo es genuinamente desconocido
function parseResponse(data: unknown) {
  if (typeof data === 'object' && data !== null && 'id' in data) {
    // ahora TypeScript sabe más sobre data
  }
}
```

**Tipar siempre las respuestas de la API.** Crear tipos en `/shared/` que usen tanto frontend como backend:

```typescript
// shared/types/product.ts
export interface Product {
  id: string
  name: string
  slug: string
  price: number
  status: 'draft' | 'available' | 'sold' | 'coming_soon'
  // ...
}

export interface ProductListResponse {
  data: Product[]
  total: number
  page: number
}
```

**Preferir `interface` sobre `type` para objetos**, y `type` para uniones y tipos derivados:
```typescript
interface User { id: string; email: string }       // objeto → interface
type UserRole = 'admin' | 'customer' | 'vendor'    // unión → type
type PartialUser = Partial<User>                    // derivado → type
```

---

## Prisma: buenas prácticas

**Un solo cliente de Prisma en toda la aplicación:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ['query', 'error'] })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Siempre usar `select` o `include` explícitos.** Nunca traer toda la tabla sin necesidad:
```typescript
// Mal — trae todas las columnas incluyendo password_hash
const user = await prisma.user.findUnique({ where: { id } })

// Bien — solo lo que necesitas
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true, role: true }
})
```

**Las migraciones son permanentes.** Nunca editar una migración ya aplicada. Crear siempre una nueva.

---

## Variables de entorno

- Todas las variables de entorno van en `.env` (nunca en el código)
- `.env` está en `.gitignore` siempre
- `.env.example` existe en el repo con las keys pero sin valores
- En el código, acceder siempre con validación:

```typescript
// lib/config.ts
function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Variable de entorno requerida: ${key}`)
  return value
}

export const config = {
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  cloudinary: {
    cloudName: requireEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: requireEnv('CLOUDINARY_API_KEY'),
    apiSecret: requireEnv('CLOUDINARY_API_SECRET'),
  },
}
```

---

## Git: flujo de trabajo

### Ramas
- `main` — producción. Solo merge cuando algo está listo y probado.
- `develop` — rama de desarrollo principal. Aquí se integra el trabajo.
- `feature/nombre-descriptivo` — una rama por feature o bloque de trabajo.

### Commits
Formato: `tipo: descripción corta en español`

Tipos:
- `feat:` — nueva funcionalidad
- `fix:` — corrección de bug
- `refactor:` — cambio de código sin cambiar comportamiento
- `style:` — cambios de formato, espaciado (sin cambios de lógica)
- `docs:` — documentación
- `chore:` — tareas de mantenimiento, dependencias

Ejemplos:
```
feat: agregar endpoint de productos con filtros por municipio
fix: corregir cálculo de precio total en orden con múltiples items
refactor: extraer lógica de filtros a función separada en products.service
docs: actualizar CLAUDE.md con decisión de manejo de tallas
```

**Nunca hacer commit de:**
- Archivos `.env`
- `node_modules/`
- Archivos de build (`.next/`, `dist/`)
- Logs o archivos temporales

---

## Lo que NUNCA hacer

- **No poner lógica de negocio en controllers o routes.** Va en services.
- **No hacer queries de Prisma fuera de services.** Los controllers no hablan con la base de datos.
- **No usar `any` en TypeScript.** Sin excepciones.
- **No eliminar registros físicamente.** Soft delete o cambio de estado siempre.
- **No hardcodear valores mágicos.** Si usas el número `22` (departamentos de Guatemala), crear una constante `GUATEMALA_DEPARTMENTS_COUNT = 22` con un comentario explicativo.
- **No ignorar errores con catch vacío.** Si cacheas un error, haz algo con él.
- **No mezclar español e inglés en el mismo contexto.** Código en inglés, comentarios de lógica de negocio en español, UI en español.
- **No dejar `console.log` en código que va a producción.** Usar un logger apropiado o eliminarlos.

---

*Actualizar este archivo cuando se tomen decisiones arquitectónicas nuevas que afecten la estructura general del proyecto.*
