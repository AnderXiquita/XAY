# CLAUDE.md — Tienda de Ropa Típica Guatemalteca

Este documento es la fuente de verdad del proyecto. Léelo completo antes de escribir cualquier línea de código. Contiene las decisiones de arquitectura, el modelo de datos, la visión de diseño, las reglas de desarrollo y el contexto de negocio. No asumas nada que no esté aquí.

---

## 1. Contexto del Proyecto

### ¿Qué es esto?

Una tienda de e-commerce de ropa típica guatemalteca. No es un proyecto genérico: tiene una identidad cultural específica, un modelo de negocio particular, y una visión de largo plazo ambiciosa.

El problema que resuelve: la ropa típica guatemalteca (guipiles, cortes, fajas, accesorios) actualmente solo se vende en tiendas físicas o perfiles de Instagram/Facebook sin orden ni profesionalismo. Esta plataforma quiere ser la primera tienda en línea que presente la ropa típica guatemalteca de forma moderna, ordenada, elegante y que funcione como un e-commerce real.

### Diferenciadores clave

1. **Catálogo curado y con estándar visual propio.** Cada producto tiene fotos de calidad, descripción detallada, contexto cultural. Nada de fotos de WhatsApp sobre una mesa.
2. **Clasificación por origen geográfico.** Guatemala → Departamento → Municipio. Cada prenda tiene su origen, y eso es parte de su valor.
3. **"Solicitar similar".** Cuando una pieza única se vende, no desaparece del catálogo. Queda visible con opción de solicitar una pieza similar hecha a mano.
4. **Fusión de ropa típica con moda moderna.** Una sección de "Complementos modernos" que muestra cómo combinar guipiles con ropa contemporánea (jeans, faldas de lona, faldas largas) sin perder la esencia cultural. Esto apunta a mujeres jóvenes que no usarían un traje típico completo pero sí un guipil bien combinado.
5. **Futuro: configurador de prendas.** En una versión posterior, los usuarios podrán diseñar su propio guipil eligiendo tela, colores, flores, tipo de bordado, cuello, y mandarlo a hacer. Esto está fuera del MVP pero la arquitectura debe anticiparlo.

### Visión de largo plazo

Si el modelo funciona en Guatemala, replicarlo en otros países con ropa típica propia (Perú, México, Bolivia, etc.), generando empleo a artesanas locales y permitiendo comprar ropa típica de cualquier país desde cualquier parte del mundo.

### Nombre y marca

**Nombre provisional: XAY** — viene de la combinación de los apellidos de los dos fundadores: **X**iquita y **A**jqueja**y**. Ya está aplicado en el Header, Footer, metadata y favicon. Si cambia en el futuro, hacer búsqueda y reemplazo global.

**Favicon:** Círculo café oscuro (#2C1810) con la letra "X" en blanco. Archivo: `frontend/public/favicon.svg`.

**Logo:** Por ahora es texto "XAY" con `Playfair Display`, `font-bold`, `letter-spacing: 0.2em`. No hay logo gráfico todavía.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | Next.js 14+ (App Router) + React + TypeScript | Renderizado híbrido, SEO, optimización de imágenes, estándar para e-commerce moderno |
| Estilos | Tailwind CSS | Utility-first, fácil de mantener, variables de diseño centralizadas |
| Backend | Node.js + Express + TypeScript | Control total, sin magia, aprendizaje real del proceso |
| Base de datos | PostgreSQL | Relacional, confiable, maneja bien las relaciones complejas del catálogo |
| ORM | Prisma | TypeScript nativo, migraciones claras, excelente DX |
| Autenticación | JWT + bcrypt (propia) + OAuth (Google, Apple) | Control total sin depender de servicios de terceros para auth básica |
| Deploy frontend | Vercel | Integración nativa con Next.js, CDN global, tier gratuito generoso |
| Deploy backend | Railway | Simple, tier gratuito para iniciar, escala bien |
| Deploy DB | Neon | PostgreSQL serverless, tier gratuito real, sin cold starts en DB |
| Almacenamiento de imágenes | Cloudinary | Optimización automática de imágenes, transformaciones on-the-fly, tier gratuito |

### TypeScript en todo

Tanto el frontend como el backend usan TypeScript. Esto no es opcional: en un sistema que maneja dinero y pedidos, los errores de tipo en tiempo de desarrollo valen mucho. Se compartirán tipos entre frontend y backend usando un paquete interno `packages/types` o una carpeta `shared/`.

### ¿Por qué no Laravel o CodeIgniter?

El desarrollador tiene experiencia con PHP/CodeIgniter en otro proyecto (Resttouch), pero para este proyecto nuevo se eligió Node.js por tres razones: (1) el frontend es JavaScript/TypeScript, así que compartir tipos y lógica entre frontend y backend es directo; (2) el ecosistema Node.js para e-commerce moderno es más activo; (3) Express sin magia obliga a entender cada decisión arquitectónica, lo cual es parte del objetivo de aprendizaje del equipo.

---

## 3. Arquitectura General

```
/
├── frontend/          # Next.js app
│   ├── app/           # App Router (Next.js 14)
│   ├── components/    # Componentes reutilizables
│   ├── lib/           # Utilidades, clientes HTTP, helpers
│   └── types/         # Tipos compartidos (o importados desde shared/)
│
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/    # Endpoints organizados por dominio
│   │   ├── controllers/
│   │   ├── services/  # Lógica de negocio (aquí vive lo importante)
│   │   ├── middleware/ # Auth, validación, errores
│   │   ├── prisma/    # Schema y migraciones
│   │   └── types/
│   └── ...
│
└── shared/            # Tipos TypeScript compartidos entre frontend y backend
```

La API es REST. No GraphQL por ahora, es complejidad innecesaria para este MVP.

---

## 4. Modelo de Datos

### Principios del modelo

- Cada pieza de ropa típica es **única**. No hay "10 unidades en stock" de un mismo guipil. El inventario es 1 pieza = 1 registro de producto.
- Los complementos modernos (jeans, faldas de lona, accesorios de proveedores) sí pueden tener cantidades.
- La jerarquía geográfica es: **Departamento → Municipio**. Cada producto típico pertenece a exactamente un municipio. Un municipio pertenece a exactamente un departamento. No se comparte origen entre lugares.
- Los productos tienen estados, no se eliminan físicamente. Esto es importante para mantener el catálogo de piezas vendidas visible.

### Entidades principales

#### `Department` (Departamento)
```
id, name, slug
```
Los 22 departamentos de Guatemala. Dato casi estático, se carga con seed.

#### `Municipality` (Municipio)
```
id, name, slug, department_id
```
Municipios de Guatemala. También cargados con seed. Cada municipio pertenece a un departamento.

#### `Category` (Categoría de producto)
```
id, name, slug, description, is_active
```
Ejemplos: Guipiles, Cortes, Fajas, Perrajes, Complementos Modernos, Accesorios.
Las categorías son extensibles. Agregar una nueva categoría no requiere tocar código, solo insertar un registro.

#### `Product` (Producto)
```
id
name                    -- Nombre descriptivo del producto
slug                    -- Para la URL: /tienda/guipil-solola-flores-rojas
description             -- Descripción cultural y de la prenda
price                   -- En quetzales (GTQ), tipo DECIMAL(10,2)
category_id             -- FK a Category
municipality_id         -- FK a Municipality (nullable: los complementos modernos no tienen origen geográfico)
supplier_id             -- FK a Supplier (nullable: solo para complementos modernos con proveedor)
is_traditional          -- BOOLEAN: true = ropa típica, false = complemento moderno
status                  -- ENUM: 'draft' | 'available' | 'sold' | 'coming_soon'
width_cm                -- Ancho de la tela en centímetros (para prendas típicas)
length_cm               -- Largo de la tela en centímetros
size_label              -- Texto libre para talla si aplica (ej: "S/M", "M/L", "Talla única")
size_notes              -- Nota explicativa sobre el ajuste (ej: "requiere costura de ajuste en laterales")
fabric_type             -- Tipo de tela (algodón, jaspe, seda vegetal, etc.)
embroidery_type         -- Tipo de bordado (a mano, a máquina, mixto)
colors                  -- Array de colores principales (TEXT[])
is_featured             -- BOOLEAN: si aparece en productos destacados de la home
allow_similar_request   -- BOOLEAN: si permite "solicitar similar" cuando está vendido
created_at, updated_at
```

**Nota importante sobre tallas:** La ropa típica no sigue tallas estándar. El modelo muestra las dimensiones reales de la pieza (ancho y largo en cm) junto con una nota explicativa. No se usa S/M/L como campo principal porque es engañoso en este contexto.

#### `ProductImage` (Fotos del producto)
```
id, product_id, url, alt_text, position, type
```
`type` es ENUM: `'main'` | `'detail'` | `'model'` | `'flat'`

Convención de fotos por producto:
- `flat`: prenda extendida sobre superficie, con fondo neutro/típico. Siempre requerida.
- `detail`: close-up del bordado o tejido.
- `model`: la prenda usada por una persona.
- `main`: la foto principal que aparece en el listado (puede coincidir con flat o model).

#### `User` (Usuario)
```
id, email, password_hash (nullable si usa OAuth), name, phone
role                    -- ENUM: 'customer' | 'admin' (en el futuro: 'vendor')
auth_provider           -- ENUM: 'local' | 'google' | 'apple'
auth_provider_id        -- ID del usuario en el proveedor OAuth
measurements_cm         -- JSONB: medidas del usuario {chest, waist, hips, shoulder_width, height}
is_active, created_at, updated_at
```

**Compra como invitado:** Los usuarios no están obligados a registrarse para comprar. Las órdenes de invitados guardan nombre, email y teléfono directamente en la orden, sin crear un registro de usuario.

**Registro obligatorio solo para:** usar el configurador de prendas personalizado (feature futura).

**OAuth:** Se soporta registro/login con Google y Apple desde el inicio. Esto es importante para reducir la fricción, especialmente en mobile.

**Medidas del usuario:** Si el usuario está registrado, puede guardar sus medidas. Esto se usará en el futuro para recomendaciones de prendas por talla.

#### `Order` (Orden de compra)
```
id, order_number        -- Número legible: ej. "GT-2025-00142"
user_id (nullable)      -- Si es null, es compra como invitado
guest_name, guest_email, guest_phone -- Para invitados
status                  -- ENUM: ver estados abajo
payment_method          -- ENUM: 'transfer' | 'deposit' | 'card'
payment_status          -- ENUM: 'pending' | 'confirmed' | 'failed' | 'refunded'
payment_reference       -- Número de boleta, referencia de transferencia, etc.
payment_confirmed_at    -- Timestamp de cuando el admin confirma el pago
subtotal, shipping_cost, total  -- DECIMAL(10,2) cada uno
shipping_address        -- JSONB: {name, phone, address_line1, municipality, department, zip}
shipping_courier        -- Nombre del courier elegido (Guatex, DHL, etc.)
shipping_tracking       -- Número de rastreo (se agrega cuando se envía)
notes                   -- Notas del cliente
admin_notes             -- Notas internas del admin
created_at, updated_at
```

**Estados de la orden:**
- `pending_payment` → creada, esperando pago
- `payment_review` → cliente dice que pagó, admin debe verificar
- `confirmed` → pago confirmado, en preparación
- `shipped` → enviado, tiene número de rastreo
- `delivered` → entregado
- `cancelled` → cancelada
- `refunded` → reembolsada

#### `OrderItem` (Ítem dentro de una orden)
```
id, order_id, product_id, quantity, unit_price, subtotal
product_snapshot        -- JSONB: snapshot del producto al momento de la compra (nombre, foto, precio)
```

El `product_snapshot` es crítico: guarda una copia de los datos del producto en el momento de la compra. Si el producto cambia después, la orden histórica sigue mostrando lo que el cliente compró.

#### `SimilarRequest` (Solicitud de pieza similar)
```
id, product_id          -- El producto vendido que sirvió de inspiración
user_id (nullable)
requester_name, requester_email, requester_phone
notes                   -- Qué quiere igual, qué quiere diferente
measurements_cm         -- JSONB: medidas específicas para este pedido
status                  -- ENUM: 'pending' | 'in_review' | 'quoted' | 'accepted' | 'in_production' | 'completed' | 'cancelled'
admin_notes
created_at, updated_at
```

#### `Supplier` (Proveedor)
```
id, name, contact_name, email, phone, notes, is_active
```
Solo para complementos modernos. La ropa típica no tiene proveedor, la trabajamos directamente con artesanas.

#### `CartItem` (Carrito — persistido en base de datos)
```
id, session_id (para invitados), user_id (para registrados), product_id, quantity, created_at
```
El carrito se persiste en BD para que no se pierda si el usuario cierra el navegador. Para invitados se usa un `session_id` guardado en cookie.

---

## 5. Reglas de Negocio Importantes

### Inventario de prendas típicas
- Cada prenda típica es única. `quantity` no aplica para ellas.
- Cuando se completa la compra, el producto cambia a status `sold`.
- Las prendas `sold` siguen visibles en el catálogo con una etiqueta "Vendido" y el botón "Solicitar similar".
- `allow_similar_request` debe ser `true` por defecto para prendas típicas.

### Inventario de complementos modernos
- Sí tienen cantidad (`quantity` en el modelo de producto o en una tabla `ProductStock`).
- Cuando llegan a 0, cambian a status `coming_soon` o simplemente no se puede agregar al carrito.

### Flujo de pago (MVP)
1. Cliente hace su pedido → orden queda en `pending_payment`.
2. Sistema muestra datos bancarios y número de orden para el concepto de la transferencia.
3. Cliente transfiere y regresa a la plataforma para marcar que pagó (sube número de boleta o referencia).
4. Orden pasa a `payment_review`.
5. Admin verifica en la banca en línea y confirma desde el panel → orden pasa a `confirmed`.
6. En el futuro, cuando se integre pasarela de tarjetas (Stripe), el paso 3-5 desaparece y se automatiza via webhook.

### Panel de administrador
Solo los usuarios con `role = 'admin'` acceden a las rutas `/admin/*`.
El panel debe permitir:
- CRUD completo de productos (con subida de fotos a Cloudinary)
- Ver y gestionar órdenes (cambiar estado, confirmar pagos, agregar tracking)
- Ver solicitudes de piezas similares
- Elegir productos destacados para la home
- Gestionar categorías y proveedores

---

## 6. Diseño y Experiencia de Usuario

### Referencia visual principal
**María Cayetana** (mariacayetana.com.mx) — tienda de huipiles mexicanos. Lo que se toma de referencia:
- Layout limpio de catálogo con sidebar de filtros a la izquierda
- Cards de productos con información justa, sin exceso
- Página de detalle de producto con foto grande y descripción estructurada
- Fondo sutil y texturizado que se mantiene al hacer scroll
- Tipografía serif elegante para títulos, sans-serif para cuerpo

Lo que se hace diferente:
- El fondo es blanco puro (#FFFFFF). Se intentaron patrones SVG inspirados en textiles pero no se logró el resultado deseado — se descartaron.
- La jerarquía geográfica (departamento/municipio) es parte visible de la navegación y los filtros
- Mapa SVG interactivo de los 22 departamentos en la home (ya implementado)
- Imágenes a pantalla completa para contenido editorial y cultural

### Paleta de colores (variables CSS en `globals.css`)
```css
--color-bg: #FFFFFF             /* Fondo principal — blanco puro (cambiado del beige original) */
--color-surface: #F5EFE6        /* Beige suave — para secciones alternadas */
--color-border: #E8DDD0         /* Borde sutil */
--color-text-primary: #2C1810   /* Café oscuro profundo */
--color-text-secondary: #6B4C3B /* Café medio */
--color-text-muted: #9C7E6F     /* Café suave */
--color-text-inverse: #FAF7F2   /* Texto claro sobre fondos oscuros */
--color-accent: #8B4513         /* Café tierra (acción principal) */
--color-accent-hover: #6B3410   /* Café oscuro (hover) */
--color-accent-light: #D4956A   /* Terracota claro (detalles) */
```

**Nota:** El fondo original era `#FAF7F2` (crema cálido) pero se cambió a `#FFFFFF` (blanco puro) porque el beige se veía demasiado "cafecito" en conjunto.

### Tipografía
- **Títulos y display:** `Playfair Display` (serif elegante, evoca artesanía y tradición)
- **Cuerpo y UI:** `DM Sans` (moderna, legible, limpia)
- Ambas disponibles en Google Fonts.

### Responsive y dispositivos

**Mobile first, siempre.** En Guatemala la mayoría del tráfico llega desde teléfono. Cada componente se diseña primero para mobile y luego se adapta hacia arriba. Nunca al revés.

Breakpoints de Tailwind que se usarán:
- Base (sin prefijo): 320px en adelante — móviles pequeños, el punto de partida
- `sm`: 640px — móviles grandes
- `md`: 768px — tablets
- `lg`: 1024px — laptops
- `xl`: 1280px — desktops
- `2xl`: 1536px — pantallas grandes

Reglas específicas para este proyecto:
- El sidebar de filtros del catálogo **no existe en mobile**. En mobile los filtros se abren como un panel deslizable desde abajo (bottom sheet) o un modal.
- La galería de fotos del producto en mobile es un carrusel horizontal. En desktop es grid o galería con thumbnail lateral.
- El carrito en mobile es una página completa. En desktop puede ser un drawer lateral.
- La navegación en mobile es un menú hamburguesa. En desktop es la barra horizontal completa.
- Las cards de productos: 1 columna en mobile pequeño, 2 columnas en mobile grande, 3 en tablet, 4 en desktop.
- Nunca usar `hover` como única forma de revelar información importante. En touch no hay hover.
- Tamaño mínimo de área táctil: 44x44px para cualquier botón o enlace interactivo.

### Principios de UX
- **Fluidez ante todo.** Las transiciones de página deben sentirse suaves. Usar el sistema de navegación de Next.js correctamente, prefetching de rutas, loading states visibles pero no intrusivos.
- **Imágenes optimizadas siempre.** Usar el componente `<Image>` de Next.js en absolutamente todas las imágenes. Nunca un `<img>` sin optimizar. Las fotos son el producto.
- **Mobile first.** Guatemala tiene mucho tráfico mobile. Todo debe diseñarse primero para mobile y luego adaptarse a desktop.
- **Accesibilidad básica.** Alt text en todas las imágenes (ya está en el modelo de datos). Contraste adecuado. Navegación por teclado funcional.
- **No lento.** María Cayetana se siente lenta. La nuestra no debe serlo. Priorizar Core Web Vitals.

### Secciones principales de la tienda

**Navegación principal:**
- Nuevos ingresos
- Tienda (con filtros por categoría, departamento, municipio, color, rango de precio)
- Cultura (sección editorial/educativa)
- Complementos Modernos
- Sobre nosotros
- Búsqueda, Favoritos, Carrito, Mi cuenta

**Home:**
- Hero con imagen grande e impactante
- Productos destacados (elegidos manualmente desde el admin)
- Sección editorial "Estilo guatemalteco moderno" (los outfits fusión)
- Explorar por departamento (mapa o grid visual)
- Historia de la marca

**Catálogo:**
- Sidebar con filtros: categoría, departamento, municipio, colores, rango de precio, estado (disponible / próximamente)
- Grid de cards de productos
- Ordenamiento: más recientes, precio ascendente/descendente, destacados

**Detalle de producto:**
- Galería de fotos (flat, detalle, modelo)
- Nombre, precio, origen (Municipio, Departamento)
- Dimensiones en cm + nota explicativa de ajuste
- Descripción cultural de la pieza
- Estado (si está vendido, mostrar "Vendido — Solicitar pieza similar")
- Botón agregar al carrito (si disponible)

**Sección Cultura** (ruta `/cultura`):
- Header fijo: título "Historias detrás de cada hilo" + descripción + pills de categorías
- Categorías: Todo, Tejido y técnicas, Departamentos, Artesanas, Idiomas, Tradiciones
- Vista "Todo": feed tipo revista con layouts variados (horizontal ancho, par asimétrico 7/5, horizontal invertido) — NO grid uniforme
- Vista de categoría individual: artículo editorial completo con imagen header, intro, secciones con subtítulos — formato blog centrado
- Transición fade (250ms) al cambiar entre categorías
- Los artículos no abren página nueva — todo cambia debajo de las pills en la misma pantalla
- CTA al final conectando cultura con la tienda
- Futuro: los artículos serán gestionados desde el panel admin (CRUD + elegir destacados)

---

## 7. Guía de Desarrollo (Reglas para Claude Code)

### Skills — leer antes de construir

El proyecto tiene tres archivos de guías especializadas en `/skills/`. Cada uno debe leerse antes de trabajar en su área correspondiente.

| Archivo | Leer antes de... |
|---|---|
| `/skills/tipical-store-design.md` | Construir cualquier componente visual, página, o layout |
| `/skills/tipical-store-architecture.md` | Escribir cualquier código de backend, service, controller, o definir estructura de carpetas |
| `/skills/tipical-store-security.md` | Construir autenticación, rutas protegidas, manejo de usuarios, o flujos de pago |

No asumir nada que no esté documentado en estos archivos o en este CLAUDE.md.

### Filosofía de construcción

**Ir parte por parte.** No construir el sistema completo de una vez. El orden sugerido:

1. Configuración base del proyecto (estructura de carpetas, ESLint, Prettier, variables de entorno)
2. Modelo de datos y migraciones con Prisma
3. Seed de datos básicos (departamentos, municipios, categorías)
4. API: endpoints de productos (GET público)
5. Frontend: layout base, navegación, página de catálogo
6. Frontend: página de detalle de producto
7. API + Frontend: carrito de compras
8. API + Frontend: flujo de checkout y órdenes
9. API + Frontend: autenticación (local + OAuth)
10. Panel de administrador
11. Subida de imágenes a Cloudinary
12. Sistema de solicitud de pieza similar
13. Favoritos
14. Sección Cultura
15. Optimización, SEO, performance

**No avanzar al siguiente bloque sin que el anterior funcione y sea entendido.**

### Convenciones de código

- Nombres en **inglés** en el código (variables, funciones, tablas, rutas de API).
- Comentarios en **español** cuando explican lógica de negocio cultural (por ejemplo, por qué no hay stock de unidades en prendas típicas).
- Rutas de API: `/api/v1/products`, `/api/v1/orders`, etc. Versionar desde el inicio.
- Errores de API siempre con estructura consistente: `{ error: string, code: string, details?: any }`.
- Variables de entorno en `.env.example` documentadas. Nunca hardcodear credenciales.

### Lo que NO hacer

- No usar `any` en TypeScript. Si no sabes el tipo, investiga o pregunta.
- No escribir lógica de negocio en los controladores. Los controladores solo reciben, delegan al service, y responden.
- No eliminar registros físicamente de la base de datos. Todo tiene soft delete o cambio de estado.
- No usar `<img>` en el frontend. Siempre `<Image>` de Next.js.
- No inventar el nombre de la marca. El nombre actual es **XAY**.

---

## 8. Estado Actual del Proyecto — Lo que ya está construido

### Frontend completado

El frontend (Next.js) ya tiene las siguientes páginas y componentes funcionales:

#### Páginas

| Ruta | Archivo | Estado |
|---|---|---|
| `/` (Home) | `app/page.tsx` | Completa y pulida (desktop + mobile) |
| `/about` (Sobre Nosotros) | `app/about/page.tsx` | Completa — hero split (texto + imagen), origen, quote, misión, visión, CTA |
| `/cultura` | `app/cultura/page.tsx` | Primera versión completa — datos hardcodeados |
| `/tienda` (Catálogo) | Pendiente | No construida — requiere backend primero |

#### Componentes de layout

| Componente | Archivo | Descripción |
|---|---|---|
| Header | `components/layout/Header.tsx` | Navegación completa desktop + mobile |
| Footer | `components/layout/Footer.tsx` | Footer con links y copyright |
| BottomNav | `components/layout/BottomNav.tsx` | Barra inferior mobile (4 íconos) |
| GuatemalaMap | `components/home/GuatemalaMap.tsx` | Mapa SVG interactivo de Guatemala |
| ImageWithSkeleton | `components/ui/ImageWithSkeleton.tsx` | Imagen con shimmer de carga |
| SmoothScroll | `components/ui/SmoothScroll.tsx` | Scroll suave global con Lenis |

#### Layout global (`app/layout.tsx`)
- Fuentes: Playfair Display (display) + DM Sans (body) vía `next/font/google`
- Header arriba, Footer abajo, BottomNav fijo en mobile
- `pb-16 lg:pb-0` en `<main>` para no tapar contenido con la barra inferior
- SmoothScroll activo con Lenis

### Home page — Secciones en orden

1. **Hero** — Carrusel de 3 imágenes con fade (10s intervalo), texto alineado a la izquierda, botón "Explorar la tienda" con borde redondeado y animación de fill en hover, puntos indicadores abajo a la derecha. `minHeight: 70vh`.
2. **Productos destacados** — Título centrado con líneas decorativas, grid 2 cols (mobile) / 4 cols (desktop), cards con imagen, hover zoom + botón "Ver producto", botón "Explorar la tienda" centrado abajo. Datos hardcodeados (4 productos de prueba).
3. **Editorial** — Sección "Cada pieza cuenta con semanas de trabajo" centrada, dos párrafos sobre el proceso artesanal, tres datos (100%, 2–8 semanas, Única).
4. **Categorías** — Título centrado con líneas, grid mosaico (fila 2 cols + fila 3 cols + fila 1 col full-width). 6 categorías con imágenes reales. `loading="eager"` para evitar problemas de lazy loading.
5. **Mapa de Guatemala** — SVG interactivo con paths reales de mapsvg.com (CC0). Click para seleccionar departamento (no hover, para evitar problemas en mobile). Panel de info a la derecha con nombre, municipios, descripción, y botón "Ver prendas". Scroll lock con `requestAnimationFrame` para evitar saltos.
6. **Nuestra historia** — Título centrado, dos columnas de texto, línea separadora, tres pilares con números grandes (01, 02, 03), botón "Conocer más sobre nosotros".

### About page (Sobre Nosotros) — Secciones en orden

1. **Hero split** — Texto editorial a la izquierda (7 cols), imagen vertical a la derecha (5 cols). Etiqueta "Sobre nosotros" con línea decorativa. NO es full-bleed como el home.
2. **El origen** — Imagen + texto en dos columnas. Historia de cómo nació XAY. Mención sutil del nombre (X = Xiquita, A+Y = Ajquejay) en un apartado pequeño con línea separadora, no como protagonista.
3. **Quote** — Frase editorial sobre imagen de fondo con overlay oscuro. "Si una prenda lleva semanas de trabajo artesanal, merece una vitrina digna."
4. **Nuestra misión** — Texto izquierda, imagen derecha. Cerrar la brecha entre tradición y mundo digital.
5. **La visión** — Centrada con líneas decorativas a ambos lados. Expansión a otros países (Guatemala, México, Perú).
6. **CTA final** — Fondo oscuro con imagen sutil de fondo (8% opacidad). "La ropa típica no es del pasado. Es el presente, bien presentado."

### Cultura page — Secciones y comportamiento

1. **Header fijo** — Etiqueta "Cultura" con línea, título "Historias detrás de cada hilo" en dos columnas (título izq, descripción der), pills de categorías horizontales con scroll en mobile.
2. **Vista "Todo"** (activeCategory === 'all') — Feed tipo revista con layouts variados que se repiten en patrón:
   - Patrón 0: card horizontal ancha con texto superpuesto sobre imagen (aspect 21/9)
   - Patrón 1+2: par asimétrico — card grande (7 cols) + card chica (5 cols) lado a lado
   - Patrón 3: card horizontal invertida — texto izquierda (fondo surface) + imagen derecha
3. **Vista de artículo** (activeCategory !== 'all') — Artículo editorial completo:
   - Imagen header con overlay y título/fecha superpuestos (aspect 21/9)
   - Cuerpo centrado (max-w-3xl), formato blog: intro, secciones con h2, párrafos, imágenes ocasionales
   - Botón "Volver a todos los artículos" al final
4. **Transiciones** — Fade out/in (250ms) con translateY sutil al cambiar de categoría.
5. **CTA** — "Cada prenda tiene una historia. Conocela en persona." con botón a la tienda.
6. **Datos** — 5 artículos hardcodeados (uno por categoría), cada uno con secciones/subtemas. Se reemplazarán por datos de la API.

**Imágenes de cultura** (en `frontend/public/image/`): `Tejidos y tecnicas.jpg`, `Departamentos.jpg`, `Artesanas.jpg`, `Idiomas.jpg`, `Tradiciones.jpg`.

### Navegación mobile — Decisiones de diseño

**Header mobile:**
- Hamburguesa a la izquierda, logo "XAY" a la derecha
- Sin íconos de búsqueda/carrito/cuenta (están en la barra inferior)
- El botón hamburguesa solo abre el menú, no alterna (la X está dentro del menú)

**Menú hamburguesa (fullscreen, `z-60`):**
- Cubre toda la pantalla incluyendo el navbar
- Header: "Menú" + X para cerrar
- Links grandes centrados: Tienda (con flecha `>` que abre submenú), Cultura, Sobre Nosotros
- Click en "Tienda" → navega a `/tienda`. Click en `>` → abre submenú
- Animación: slide desde la izquierda (350ms cubic-bezier)

**Submenú de tienda (fullscreen, `z-70`):**
- Se desliza desde la derecha sobre el menú principal
- Header: `<` (volver) a la izquierda, `X` (cerrar todo) a la derecha
- Categorías con títulos pequeños (Ropa Típica, Complementos, Explorar) y links grandes debajo
- Tipografía: títulos `text-sm uppercase tracking-[0.2em]`, links `text-lg font-light font-body`

**Barra inferior (`BottomNav`, `z-50`):**
- 4 íconos: Inicio, Buscar, Carrito, Mi cuenta
- Fijo en la parte inferior, solo visible en mobile (`lg:hidden`)
- Fondo blanco con backdrop-blur
- Ícono activo se pinta con color accent
- Badge numérico en carrito (cuando tenga items)

### Patrones de diseño establecidos

**Títulos de sección:** Centrados con líneas decorativas horizontales:
```
── ETIQUETA ──
Título Grande
```

**Botones:** Borde redondeado (`border-radius: 9999px`), solo borde sin fill, animación de fill en hover (`background-color 300ms, color 300ms, border-color 300ms`).

**Scrollbar:** Personalizado — 6px de ancho, colores que combinan con la paleta.

**Imágenes con skeleton:** Componente `ImageWithSkeleton` que muestra shimmer animado mientras carga la imagen. No interfiere con los estilos del `<Image>` original (no usa z-index ni opacity override).

**Smooth scroll:** Implementado con la librería Lenis (`@studio-freight/lenis`).

**Problema conocido resuelto — Lenis vs scrolls programáticos:**
Lenis corre en un loop de `requestAnimationFrame` y sobreescribe la posición del scroll en cada frame mientras hay momentum (el "patín" después de soltar el scroll). Si se llama `window.scrollTo()` mientras Lenis está decelerando, Lenis pisa encima y el scroll programático se ignora.

**Solución aplicada:**
- `SmoothScroll.tsx` expone la instancia de Lenis en `window.__lenis` al montarse (y la elimina en el cleanup).
- Antes de cualquier `window.scrollTo()` programático, se llama `(window as any).__lenis?.stop()` para pausar Lenis.
- Se ejecuta el `window.scrollTo()` normalmente.
- Se llama `requestAnimationFrame(() => (window as any).__lenis?.start())` para reactivar Lenis en el siguiente frame, una vez el browser ya aplicó la nueva posición.

**Cuándo aplicar este patrón:** Siempre que se necesite hacer un scroll programático (`window.scrollTo`, saltar a una sección, etc.) en cualquier página que use el layout global. Sin este patrón, el scroll funciona solo cuando la página está completamente quieta pero falla intermitentemente si el usuario acababa de scrollear.

### Imágenes actuales (en `frontend/public/image/`)

- Hero: `1.jpg`, `6.jpg`, `Perajes.jpg` (carrusel)
- Productos destacados: `Destacadas 1.jpg` a `Destacadas 4.jpg`
- Categorías: `Guipiles.jpeg`, `Cortes.jpg`, `Fajas.jpeg`, `Souvenirs.jpeg`, `Complementos.jpeg`, `Perajes.jpg`
- Cultura: `Tejidos y tecnicas.jpg`, `Departamentos.jpg`, `Artesanas.jpg`, `Idiomas.jpg`, `Tradiciones.jpg`
- Mapa: `guatemala-map.svg` (CC0 de mapsvg.com)
- Favicon: `favicon.svg` (círculo negro #000000 con "X" blanca)

**Importante sobre imágenes:** Next.js cachea imágenes optimizadas en `.next/cache/`. Si se reemplazan imágenes con el mismo nombre, hay que eliminar la carpeta `.next` y reiniciar el dev server (`rm -rf .next && npm run dev`).

### Lo que falta construir (en orden sugerido)

1. ~~**Página Cultura** (`/cultura`) — sección editorial/educativa~~ ✅ Primera versión completa (datos hardcodeados)
2. **Backend completo** — Prisma schema, migraciones, seed, API REST
3. **Página de catálogo** (`/tienda`) — grid de productos con filtros, conectada a la API
4. **Página de detalle de producto** — galería de fotos, info completa, botón agregar al carrito
5. **Carrito de compras** — persistido en BD, drawer en desktop, página completa en mobile
6. **Checkout y órdenes** — flujo de pago por transferencia
7. **Autenticación** — login/registro local + OAuth (Google, Apple)
8. **Panel de administrador** — CRUD de productos, gestión de órdenes, subida de imágenes, gestión de artículos culturales
9. **Sistema de solicitud de pieza similar**
10. **Favoritos**
11. **Optimización, SEO, performance**

---

## 9. Entorno de Desarrollo

### Node.js
- Versión requerida: **Node 20** (usar nvm para cambiar de versión)
- El desarrollador tiene nvm instalado con Node 16 (para Resttouch) y Node 20 (para este proyecto)
- Antes de trabajar en este proyecto: `nvm use 20`
- Antes de trabajar en Resttouch: `nvm use 16`
- El proyecto tiene un archivo `.nvmrc` en la raíz con el contenido `20` para que nvm sepa qué versión usar automáticamente

### Docker (base de datos y servicios locales)
Docker maneja todos los servicios de infraestructura en desarrollo. No se usa XAMPP ni instalaciones directas en el sistema operativo. Esto garantiza que el entorno sea reproducible en cualquier máquina (Windows, Ubuntu) y que un problema en la base de datos no afecte el sistema operativo.

**Servicios en Docker:**
- `postgres` — Base de datos PostgreSQL (puerto 5432)
- `pgadmin` — Interfaz visual para explorar la base de datos en desarrollo (puerto 5050)

**Archivo `docker-compose.yml` en la raíz del proyecto:**
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: tipical_store_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: tipical_store_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

**Comandos esenciales:**
```bash
# Levantar todos los servicios
docker compose up -d

# Detener los servicios (sin borrar datos)
docker compose stop

# Ver logs de la base de datos
docker compose logs postgres

# Bajar todo y borrar contenedores (los datos persisten en el volumen)
docker compose down

# Borrar todo incluyendo datos (reset completo)
docker compose down -v
```

**Importante:** Los datos de PostgreSQL persisten en un volumen de Docker (`postgres_data`). Aunque bajes el contenedor, los datos siguen ahí. Solo `docker compose down -v` los borra. Esto resuelve el problema de corrupción que ocurría con XAMPP.

### Replicar el entorno en Ubuntu (laptop)
1. `nvm install 20 && nvm use 20`
2. Instalar Docker Desktop para Linux o Docker Engine + Docker Compose
3. `git clone <repositorio>`
4. `cp .env.example .env` y llenar las variables
5. `docker compose up -d`
6. `npm install` en cada carpeta (`frontend/`, `backend/`)
7. `npx prisma migrate dev` en `backend/`

---

## 10. Variables de Entorno Necesarias

```env
# Base de datos (Docker local)
DB_USER=tipical_user
DB_PASSWORD=
DB_NAME=tipical_store
DATABASE_URL=postgresql://tipical_user:PASSWORD@localhost:5432/tipical_store

# pgAdmin (solo desarrollo)
PGADMIN_EMAIL=admin@tipical.dev
PGADMIN_PASSWORD=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_API_URL=http://localhost:3001
BRAND_NAME=XAY
NODE_ENV=development
```

---

## 11. Lo que viene después del MVP (no construir ahora, solo tener en mente)

- **Configurador de prendas personalizado:** El usuario diseña su guipil eligiendo tela, colores, flores, bordado, tipo de cuello, y lo manda a hacer. Requiere un editor visual (posiblemente Canvas o Three.js para el render 3D), integración con el equipo de producción, y un flujo de cotización. La arquitectura del backend debe anticipar que un `Order` puede contener ítems de tipo "personalizado" además de productos del catálogo.
- **Medidas del usuario para recomendaciones:** El sistema usa las medidas guardadas para sugerir prendas que podrían quedarle bien.
- **Integración con pasarela de pagos (Stripe):** Automatiza la confirmación de pagos con tarjeta via webhooks.
- **Expansión a otros países:** El modelo geográfico (Department/Municipality) está pensado para Guatemala, pero se puede generalizar a Region/Subregion con un campo `country`. Anticipar esto en el modelo si no complica el MVP.
- **Apertura a vendedores:** El campo `role` en User ya tiene `vendor` como valor futuro. Cuando se implemente, los vendedores podrán subir productos que quedan en `draft` hasta que el admin los apruebe.
- **Facturación electrónica FEL (SAT Guatemala):** Integración con un proveedor certificado como Infile. No es para el MVP pero es necesaria cuando el negocio formalice sus operaciones.

---

*Este documento debe actualizarse cada vez que se tome una decisión arquitectónica importante o cambie algo del modelo de negocio. Es un documento vivo.*
