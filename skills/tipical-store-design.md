# Tipical Store — Design Skill

Lee este archivo completo antes de construir cualquier componente visual del proyecto. Aquí están todas las decisiones de diseño tomadas. No las inventes, no las cambies sin consultar.

---

## Identidad visual

### ¿Qué es esto?
Una tienda de ropa típica guatemalteca. No es una tienda genérica de ropa. Cada decisión visual debe evocar Guatemala: su cultura, sus textiles, sus colores de mercado, su calidez. El objetivo es que alguien que entre a la página sienta que está en un lugar que respeta y celebra lo guatemalteco, no en otro Shopify cualquiera.

### Tono visual
**Elegante y artesanal.** No rústico ni folclórico forzado. Tampoco frío ni minimalista extremo. El punto medio entre una tienda de moda internacional y la calidez de un mercado de artesanías bien curado. Piensa en cómo se vería un guipil antiguo en una galería de arte moderna: respeto por la pieza, presentación impecable.

### Referencia principal
María Cayetana (mariacayetana.com.mx) — tienda de huipiles mexicanos. Se toma de ella:
- Layout limpio de catálogo con sidebar de filtros
- Cards de producto con información justa
- Tipografía serif para títulos
- Fondo sutil que respira

Se hace diferente:
- El fondo tendrá patrones inspirados en textiles guatemaltecos (jaspe, brocado), no figuras genéricas
- La navegación geográfica (departamento/municipio) es parte visible del diseño
- Imágenes editoriales a pantalla completa para el contenido cultural
- Más personalidad guatemalteca en cada detalle

---

## Sistema de diseño

### Paleta de colores
Usar siempre variables CSS. Nunca valores hardcodeados de color en componentes.

```css
/* Fondos */
--color-bg:           #FAF7F2;   /* Crema cálido — fondo principal */
--color-surface:      #F5EFE6;   /* Beige suave — cards, paneles */
--color-surface-alt:  #EDE4D8;   /* Beige más oscuro — hover de superficie */
--color-border:       #E8DDD0;   /* Borde sutil */

/* Texto */
--color-text-primary:   #2C1810; /* Café oscuro profundo — títulos, texto principal */
--color-text-secondary: #6B4C3B; /* Café medio — texto secundario */
--color-text-muted:     #9C7E6F; /* Café suave — placeholders, metadata */
--color-text-inverse:   #FAF7F2; /* Crema — texto sobre fondos oscuros */

/* Acción */
--color-accent:       #8B4513;   /* Café tierra — botones primarios, links activos */
--color-accent-hover: #6B3410;   /* Café oscuro — hover del acento */
--color-accent-light: #D4956A;   /* Terracota claro — detalles, badges */
--color-accent-subtle:#F0E0D0;   /* Terracota muy suave — fondos de highlight */

/* Estados */
--color-success: #5A7A4A;  /* Verde tierra */
--color-error:   #A0392B;  /* Rojo arcilla */
--color-warning: #C17B2A;  /* Ámbar cálido */
```

### Tipografía
```css
--font-display: 'Playfair Display', Georgia, serif;  /* Títulos, nombres de productos, headers */
--font-body:    'DM Sans', system-ui, sans-serif;     /* UI, descripiciones, botones, metadata */
```

Importar desde Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Escala tipográfica:
```css
--text-xs:   0.75rem;   /* 12px — metadata, badges */
--text-sm:   0.875rem;  /* 14px — texto secundario, labels */
--text-base: 1rem;      /* 16px — texto de cuerpo */
--text-lg:   1.125rem;  /* 18px — texto destacado */
--text-xl:   1.25rem;   /* 20px — subtítulos */
--text-2xl:  1.5rem;    /* 24px — títulos de sección */
--text-3xl:  1.875rem;  /* 30px — títulos de página */
--text-4xl:  2.25rem;   /* 36px — títulos grandes */
--text-5xl:  3rem;      /* 48px — display/hero */
--text-6xl:  3.75rem;   /* 60px — display grande */
```

Reglas de uso:
- `font-display` para: nombres de productos, títulos de sección, nombres de departamentos, hero text
- `font-body` para: todo lo demás (descripciones, botones, navegación, precios, labels)
- Nunca usar `font-display` en textos de más de 3 líneas seguidas
- Peso 400 para cuerpo, 600 para énfasis en body, 700 para títulos principales

### Espaciado
Basado en múltiplos de 4px. En Tailwind usar la escala estándar.
```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-6:  24px
--space-8:  32px
--space-12: 48px
--space-16: 64px
--space-24: 96px
```

### Bordes y radios
```css
--radius-sm: 4px;   /* Inputs, badges pequeños */
--radius-md: 8px;   /* Cards, botones */
--radius-lg: 16px;  /* Panels, modales */
--radius-xl: 24px;  /* Cards grandes */
--radius-full: 9999px; /* Pills, avatares */
```

### Sombras
```css
--shadow-sm: 0 1px 3px rgba(44, 24, 16, 0.08);
--shadow-md: 0 4px 12px rgba(44, 24, 16, 0.10);
--shadow-lg: 0 8px 24px rgba(44, 24, 16, 0.12);
--shadow-xl: 0 16px 48px rgba(44, 24, 16, 0.15);
```

Nota: las sombras usan el color café oscuro del proyecto (`#2C1810`) en lugar del negro genérico. Esto mantiene la calidez incluso en las sombras.

---

## Componentes clave

### Cards de producto
- Fondo `--color-surface`
- Radio `--radius-xl`
- Sombra `--shadow-sm` en reposo, `--shadow-md` en hover
- Imagen ocupa el 65% de la altura de la card
- Transición suave en hover: leve escala de imagen (1.03) + sombra más pronunciada
- Badge de estado ("Vendido", "Próximamente") en esquina superior izquierda de la imagen
- Nombre del producto en `font-display` weight 600
- Municipio/Departamento en `font-body` texto muted, tamaño sm
- Precio en `font-body` weight 600, color text-primary
- El botón de favorito aparece en hover sobre la imagen (corazón)

### Botones
```
Primario:   bg accent, text inverse, hover bg accent-hover
Secundario: bg transparent, border accent, text accent, hover bg accent-subtle
Ghost:      bg transparent, text text-secondary, hover bg surface-alt
```
- Todos con `border-radius: var(--radius-md)`
- Padding horizontal generoso: mínimo 24px
- Transición de 150ms en color y fondo
- Nunca usar `cursor: default` en botones activos

### Inputs y formularios
- Border `--color-border`, focus border `--color-accent`
- Background `--color-surface`
- Label siempre visible (nunca solo placeholder)
- Error state con `--color-error` en borde y mensaje debajo

### Navegación principal
- Fondo `--color-bg` con sutil backdrop blur al hacer scroll
- Logo a la izquierda en `font-display`
- Links en `font-body` weight 500
- Iconos de acción (búsqueda, favoritos, carrito, cuenta) a la derecha
- En mobile: menú hamburguesa, el drawer se abre desde la izquierda

### Sidebar de filtros (catálogo, solo desktop)
- Ancho fijo: 280px
- Sticky al hacer scroll
- Secciones colapsables con animación suave
- En mobile NO existe: los filtros se abren como bottom sheet

---

## Patrones de fondo

El fondo principal (`--color-bg`) no es un color plano. Tiene una textura muy sutil inspirada en textiles guatemaltecos. La implementación recomendada es un SVG pattern repetido con opacidad muy baja (3-5%) sobre el color de fondo. El patrón debe evocar el jaspe o el brocado sin ser literal ni distractivo. Si no se tiene el SVG listo, usar el color plano mientras tanto, nunca un patrón genérico de rombos o cuadros.

---

## Responsive

**Mobile first siempre.** Diseñar el componente para 320px primero, luego expandir.

Breakpoints (Tailwind):
- Base (sin prefijo): 320px+ — móvil pequeño
- `sm`: 640px+ — móvil grande
- `md`: 768px+ — tablet
- `lg`: 1024px+ — laptop
- `xl`: 1280px+ — desktop
- `2xl`: 1536px+ — pantalla grande

Grids de productos:
- Mobile (320-639px): 1 columna
- Mobile grande (640-767px): 2 columnas
- Tablet (768-1023px): 2-3 columnas
- Desktop (1024px+): 3-4 columnas con sidebar, 4-5 sin sidebar

Reglas críticas para mobile:
- Área táctil mínima: 44x44px en cualquier elemento interactivo
- Nunca revelar información importante solo en hover (en touch no hay hover)
- Sidebar de filtros: NO existe en mobile. Reemplazar con bottom sheet o botón "Filtrar"
- Carrito en mobile: página completa, no drawer lateral
- Tipografía en mobile: reducir 1-2 escalas respecto a desktop

---

## Animaciones y transiciones

### Principios
- Menos es más. Una animación bien ejecutada vale más que diez mediocres.
- Las animaciones deben tener propósito: orientar, confirmar, deleitar.
- Nunca animar algo que el usuario necesita ver rápido (mensajes de error, confirmaciones).

### Valores estándar
```css
--transition-fast:   150ms ease;       /* Hover de botones, cambios de color */
--transition-base:   250ms ease;       /* Transiciones de UI generales */
--transition-slow:   400ms ease;       /* Modales, drawers, paneles */
--transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1); /* Elementos que "saltan" */
```

### Transiciones de página
Next.js con Framer Motion para transiciones suaves entre rutas. Fade + leve movimiento vertical (20px → 0). Duración 300ms. No usar transiciones elaboradas en cada página, solo una consistente en todo el sitio.

### Micro-interacciones recomendadas
- Cards de producto: escala de imagen en hover (transform: scale(1.03))
- Botón agregar al carrito: breve animación de confirmación (check icon, 600ms)
- Contador del carrito: bounce cuando aumenta
- Imagen de producto al hacer zoom: transición suave de opacidad

---

## Imágenes

**Regla absoluta: nunca `<img>` en el frontend. Siempre `<Image>` de Next.js.**

```tsx
import Image from 'next/image'

// Correcto
<Image
  src={product.images[0].url}
  alt={product.images[0].alt_text}
  width={600}
  height={800}
  className="object-cover"
/>

// Incorrecto — nunca hacer esto
<img src={product.images[0].url} />
```

Ratios de imagen por contexto:
- Card de producto en catálogo: 3:4 (vertical, como una foto de moda)
- Detalle de producto principal: 4:5 o 1:1
- Hero de página: 16:9 o pantalla completa
- Foto editorial (sección cultural): libre, aprovechar el ancho completo
- Thumbnail de carrito: 1:1

Cloudinary se usa para servir todas las imágenes. Las URLs de Cloudinary permiten transformaciones: tamaño, formato, calidad. Usar siempre el formato `webp` y calidad `auto`.

---

## Lo que NUNCA hacer

- No usar `Inter`, `Roboto`, `Arial`, o `system-ui` como fuente principal visible
- No usar sombras con color negro puro (`rgba(0,0,0,...)`) — usar el café del proyecto
- No usar borders con color negro — usar `--color-border`
- No usar azules, morados, o verdes brillantes en ningún elemento de UI
- No hacer cards con bordes rectos (radio 0) — se ve duro
- No poner texto blanco sobre el fondo crema sin suficiente contraste
- No usar animaciones con `ease-in` solas — siempre terminar suave
- No diseñar solo para desktop y luego "arreglar" mobile — mobile first
- No inventar colores fuera de la paleta definida — si falta un color, preguntar
- No usar el nombre de la marca hasta que esté definido — usar `[NOMBRE DE LA MARCA]`

---

## Checklist antes de entregar un componente

- [ ] ¿Funciona en 320px sin scroll horizontal?
- [ ] ¿Los textos son legibles en mobile (mínimo 14px)?
- [ ] ¿Los elementos táctiles tienen al menos 44x44px?
- [ ] ¿Se usó `<Image>` de Next.js para todas las imágenes?
- [ ] ¿Los colores vienen de variables CSS, no hardcodeados?
- [ ] ¿Las fuentes son Playfair Display y DM Sans, no Inter ni Roboto?
- [ ] ¿Las transiciones se sienten suaves, no bruscas?
- [ ] ¿El componente se ve bien tanto en mobile como en desktop?
- [ ] ¿Los estados de hover no son la única forma de acceder a información?

---

*Este archivo es parte del sistema de diseño del proyecto. Actualizarlo cuando se tomen nuevas decisiones visuales.*
