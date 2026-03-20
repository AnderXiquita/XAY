# Tipical Store — Security Skill

Lee este archivo antes de construir cualquier cosa relacionada con autenticación, rutas protegidas, manejo de datos de usuarios, o flujos de pago. Este no es un proyecto de juguete: maneja datos personales, direcciones y dinero real de clientes guatemaltecos. Los errores de seguridad tienen consecuencias reales.

Las reglas aquí no son sugerencias. Son requisitos.

---

## Principio base

**Nunca confiar en lo que llega del cliente.** Todo input del usuario, ya sea un campo de formulario, un parámetro de URL, un header, o el body de una request, debe validarse y sanitizarse antes de usarse. El cliente puede enviar cualquier cosa, intencionalmente o no.

---

## Autenticación con JWT

### Configuración del token
```typescript
// lib/jwt.ts
import jwt from 'jsonwebtoken'
import { config } from './config'

export interface TokenPayload {
  userId: string
  role: 'admin' | 'customer' | 'vendor'
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
    issuer: 'tipical-store',
  })
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload
}
```

**Reglas de JWT:**
- El secret debe tener mínimo 32 caracteres aleatorios. Nunca usar strings simples como `"secret"` o `"tipical123"`.
- Expiration siempre definida. Nunca tokens sin expiración.
- El payload solo lleva `userId` y `role`. Nunca incluir contraseña, datos bancarios, ni información sensible en el token.
- El token se envía en el header `Authorization: Bearer <token>`, no en cookies sin flags de seguridad.

### Middleware de autenticación
```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'
import { AppError } from '../lib/AppError'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token requerido', 401, 'UNAUTHORIZED')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyToken(token)
    req.user = payload // extender el tipo de Request
    next()
  } catch {
    throw new AppError('Token inválido o expirado', 401, 'INVALID_TOKEN')
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    throw new AppError('Acceso denegado', 403, 'FORBIDDEN')
  }
  next()
}
```

---

## Contraseñas

**Nunca guardar contraseñas en texto plano.** Siempre hashear con bcrypt antes de guardar.

```typescript
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12 // mínimo 10, 12 es el balance correcto entre seguridad y rendimiento

// Al crear usuario
const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS)

// Al verificar login
const isValid = await bcrypt.compare(plainPassword, storedHash)
```

**Nunca:**
- Guardar la contraseña original en ningún log, variable temporal, o campo de la DB
- Devolver el `password_hash` en ninguna respuesta de la API
- Usar MD5 o SHA1 para contraseñas (son inseguros para este uso)

**En Prisma, el campo siempre se excluye en los selects:**
```typescript
const user = await prisma.user.findUnique({
  where: { email },
  select: {
    id: true,
    email: true,
    password_hash: true, // solo cuando se necesita para verificar login
    role: true,
    name: true,
  }
})
```

---

## Validación de inputs

**Toda request que llega al backend debe validarse.** Usar `zod` para esto.

```typescript
import { z } from 'zod'
import { AppError } from '../lib/AppError'

// Definir el schema del request
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive().max(10),
  })).min(1),
  shippingAddress: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^\+?[\d\s\-]{8,15}$/),
    addressLine1: z.string().min(5).max(200),
    municipality: z.string().min(2).max(100),
    department: z.string().min(2).max(100),
  }),
  paymentMethod: z.enum(['transfer', 'deposit', 'card']),
  notes: z.string().max(500).optional(),
})

// Middleware de validación
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      throw new AppError(
        'Datos inválidos',
        400,
        'VALIDATION_ERROR',
      )
    }
    req.body = result.data // datos limpios y tipados
    next()
  }
}

// Uso en routes
router.post('/orders', authenticate, validate(createOrderSchema), createOrder)
```

**Qué validar siempre:**
- Tipos de datos (string, number, boolean)
- Longitudes mínimas y máximas en strings
- Formatos (email, teléfono, UUID)
- Rangos en números (precios positivos, cantidades razonables)
- Enums solo con valores permitidos

---

## Protección de rutas del admin

**Todas las rutas `/admin/*` y `/api/v1/admin/*` requieren dos verificaciones: autenticado + rol admin.**

```typescript
// routes/admin.ts
import { authenticate, requireAdmin } from '../middleware/auth'

// Aplicar a todo el router de admin de una vez
router.use(authenticate, requireAdmin)

// Ahora todas las rutas de este router están protegidas
router.get('/orders', getOrders)
router.patch('/orders/:id/status', updateOrderStatus)
router.post('/products', createProduct)
```

**En el frontend, las rutas `/admin/*` de Next.js también deben protegerse:**
```typescript
// middleware.ts (Next.js middleware)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

La verificación real del rol siempre ocurre en el backend. El frontend solo redirige para UX, pero nunca es la última línea de defensa.

---

## Protección contra ataques comunes

### Inyección SQL
Prisma usa queries parametrizadas por defecto. **Nunca construir queries SQL con concatenación de strings.**
```typescript
// Nunca hacer esto
const result = await prisma.$queryRaw`SELECT * FROM products WHERE name = ${userInput}`

// Siempre usar los métodos de Prisma
const result = await prisma.product.findMany({
  where: { name: { contains: userInput } }
})
```

### Rate limiting
Limitar requests por IP para proteger endpoints sensibles:
```typescript
import rateLimit from 'express-rate-limit'

// Para login: máximo 5 intentos por 15 minutos
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos. Espera 15 minutos.', code: 'RATE_LIMITED' }
})

// Para la API general: 100 requests por minuto
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
})

// Aplicar en app.ts
app.use('/api/', apiLimiter)
app.use('/api/v1/auth/login', loginLimiter)
```

### CORS
Solo permitir el origen del frontend:
```typescript
import cors from 'cors'

app.use(cors({
  origin: process.env.FRONTEND_URL, // 'http://localhost:3000' en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))
```

### Headers de seguridad
```typescript
import helmet from 'helmet'

app.use(helmet()) // agrega headers de seguridad estándar automáticamente
```

### Sanitización de datos
Antes de guardar cualquier texto libre en la base de datos (descripciones, notas, nombres), sanitizarlo para evitar XSS:
```typescript
import DOMPurify from 'isomorphic-dompurify'

const cleanDescription = DOMPurify.sanitize(rawDescription)
```

---

## Datos sensibles: reglas absolutas

**Nunca exponer en la API:**
- `password_hash` de usuarios
- Tokens JWT completos en respuestas
- Credenciales de Cloudinary, JWT secret, o cualquier variable de entorno
- Datos completos de tarjetas de crédito (Stripe maneja esto, nunca pasa por nuestro backend)
- `admin_notes` de órdenes en endpoints públicos

**Nunca loggear:**
- Contraseñas (ni hasheadas)
- Tokens de autenticación
- Datos de tarjetas
- Información personal completa de usuarios en logs de producción

**En respuestas de error:** nunca revelar detalles internos del sistema. El mensaje de error para el usuario debe ser genérico. El detalle va al log del servidor.
```typescript
// Mal — revela estructura interna
res.status(500).json({ error: 'Cannot read property id of undefined at products.service.ts:47' })

// Bien — genérico para el cliente, detallado en el log
console.error('Error en getProductBySlug:', error)
res.status(500).json({ error: 'Error interno del servidor', code: 'INTERNAL_ERROR' })
```

---

## Subida de archivos (imágenes)

Las imágenes se suben directo a Cloudinary desde el panel admin. El backend solo recibe la URL de Cloudinary, nunca el archivo binario directamente.

Si en algún momento el backend recibe archivos:
- Validar tipo MIME del archivo, no solo la extensión
- Validar tamaño máximo (máx 10MB por imagen)
- Nunca ejecutar archivos subidos por usuarios
- Nunca guardar archivos en el sistema de archivos del servidor, siempre en Cloudinary

---

## Checklist de seguridad antes de deployar

- [ ] ¿Todas las variables de entorno sensibles están en `.env` y no en el código?
- [ ] ¿El `.env` está en `.gitignore`?
- [ ] ¿Las rutas del admin requieren `authenticate` + `requireAdmin`?
- [ ] ¿Los inputs de todos los endpoints se validan con zod?
- [ ] ¿El `password_hash` nunca aparece en respuestas de la API?
- [ ] ¿Está configurado CORS solo para el origen del frontend?
- [ ] ¿Está instalado y configurado helmet?
- [ ] ¿Está configurado rate limiting en los endpoints de auth?
- [ ] ¿Los mensajes de error no revelan detalles internos del sistema?
- [ ] ¿El JWT secret tiene al menos 32 caracteres aleatorios?

---

*Este archivo cubre los riesgos reales del MVP. A medida que el proyecto crezca y se agreguen pagos con tarjeta, se deberá revisar el cumplimiento de PCI DSS para el flujo de Stripe.*
