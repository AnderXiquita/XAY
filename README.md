# XAY

Tienda en línea de ropa típica guatemalteca.

> **En desarrollo.** El proyecto todavía se está construyendo y aún no vende piezas reales. Los productos que se ven son de prueba.

## Qué es

Hoy la ropa típica (güipiles, cortes, fajas, perrajes) se vende casi siempre en tiendas físicas o en perfiles de Instagram y Facebook, sin orden y con poca información. Con XAY queremos una tienda en línea que presente cada pieza como se merece: buenas fotos, medidas reales, el municipio y departamento de donde viene, y la historia detrás del tejido.

Algunas ideas que guían el proyecto:

- **Cada prenda típica es única.** No hay "10 unidades" de un güipil: cuando se vende, sigue visible en el catálogo como vendida, con la opción de pedir una pieza similar.
- **El origen importa.** Las piezas se pueden explorar por departamento y municipio, incluido un mapa de Guatemala en la página de inicio.
- **Medidas en centímetros, no tallas.** La ropa típica no sigue tallas estándar, así que se muestran el ancho y el largo reales de la pieza.
- **Ropa típica con ropa moderna.** Una sección de complementos para combinar un güipil con jeans o faldas modernas.
- **Mobile first.** La mayoría del tráfico en Guatemala viene del teléfono.

## Estado actual

Lo que ya funciona:

- Página de inicio, Sobre nosotros y una primera versión de la sección Cultura
- Catálogo con filtros (categoría, departamento, municipio, precio) y detalle de producto con galería, video y zoom
- Cuentas de usuario: registro, inicio de sesión, datos personales y direcciones de entrega
- Favoritos y carrito, con y sin cuenta
- Panel de administración: productos, categorías, proveedores y usuarios

Lo que sigue:

- Subida de fotos y videos a Cloudinary desde el panel
- Checkout y pedidos (pago por transferencia o depósito, confirmado por la administración)
- Solicitud de pieza similar
- Inicio de sesión con Google y Apple, y recuperar contraseña
- Optimización, SEO y rendimiento

Más adelante nos gustaría agregar un configurador para diseñar un güipil a medida y, si el modelo funciona, llevarlo a otros países con ropa típica propia.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Base de datos | PostgreSQL con Prisma |
| Autenticación | JWT + bcrypt, sesión en cookie httpOnly |
| Validación | Zod |
| Imágenes | Cloudinary (en proceso) |
| Desarrollo local | Docker (PostgreSQL y pgAdmin) |
| Producción | Vercel (frontend), Render (backend), Neon (base de datos) |

## Estructura

```
XAY/
├── frontend/   # Next.js: tienda, cuentas y panel de administración
├── backend/    # API REST en Express (/api/v1/...), Prisma y migraciones
├── shared/     # Tipos compartidos
└── docker-compose.yml
```

El backend sigue una separación simple: las rutas solo definen los endpoints, los controladores reciben y responden, y la lógica de negocio vive en los services.

## Correrlo en local

Necesitas **Node 20** (hay un `.nvmrc`) y **Docker**.

1. Clona el repositorio y copia las variables de entorno:

   ```bash
   cp .env.example .env
   ```

   Llena los valores. El backend lee su propio `backend/.env` (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`…) y el frontend `frontend/.env.local` (`NEXT_PUBLIC_API_URL`). `JWT_SECRET` debe tener al menos 32 caracteres.

2. Levanta la base de datos:

   ```bash
   docker compose up -d
   ```

3. Backend (queda en `http://localhost:3001`):

   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run prisma:seed   # departamentos, municipios, categorías y productos de prueba
   npm run dev
   ```

4. Frontend (queda en `http://localhost:3000`):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Para entrar al panel de administración, un usuario necesita `role = 'admin'` en la tabla `users` (por ahora se cambia directo en la base de datos).

## Deploy

Cada push a `master` despliega solo: Vercel publica el frontend y Render el backend. Render aplica las migraciones pendientes durante el build (`prisma migrate deploy`), así que no hay que correrlas a mano en producción.
