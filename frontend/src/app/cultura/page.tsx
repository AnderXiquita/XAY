'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useCallback } from 'react'

/* ============================================
   TIPOS — Estructura de un artículo cultural.
   Cada categoría tiene UN artículo principal
   dividido en secciones/subtemas.
   ============================================ */

interface ArticleSection {
  id: string
  title: string
  content: string[]
  image?: string
  imageAlt?: string
}

interface CategoryArticle {
  id: string
  label: string
  title: string
  date: string
  readTime: string
  headerImage: string
  headerImageAlt: string
  intro: string[]
  sections: ArticleSection[]
}

/* ============================================
   DATOS HARDCODEADOS — Se reemplazarán por datos
   de la API cuando el backend esté listo.
   El admin podrá crear, editar y destacar
   artículos desde el panel.
   ============================================ */

const categoryArticles: CategoryArticle[] = [
  {
    id: 'tejido',
    label: 'Tejido y técnicas',
    title: 'El arte del tejido guatemalteco: técnicas que llevan siglos perfeccionándose',
    date: '15 de marzo, 2026',
    readTime: '12 min de lectura',
    headerImage: '/image/Tejidos y tecnicas.jpg',
    headerImageAlt: 'Detalle de tejido guatemalteco en telar de cintura',
    intro: [
      'El tejido en Guatemala no es una industria — es un idioma. Cada técnica, cada herramienta, cada forma de tensar el hilo responde a una tradición que se ha transmitido de madre a hija durante generaciones. Hay comunidades donde las niñas aprenden a tejer antes de aprender a escribir.',
      'Pero este conocimiento no es estático. Las tejedoras contemporáneas están adaptando técnicas ancestrales a diseños nuevos, combinando patrones tradicionales con paletas de color modernas, sin perder la esencia del proceso artesanal.',
    ],
    sections: [
      {
        id: 'telar-cintura',
        title: 'El telar de cintura',
        content: [
          'El telar de cintura es la técnica más antigua y más extendida en Guatemala. Su principio es elegante en su simplicidad: un extremo del telar se amarra a un poste o árbol, y el otro se sujeta al cuerpo de la tejedora con una faja que rodea su cintura. La tensión del tejido depende literalmente de su cuerpo.',
          'Esta conexión física entre la artesana y la tela no es solo funcional — es simbólica. Las tejedoras mayas hablan de "sentir" el tejido, de saber cuándo un hilo está demasiado tenso o demasiado suelto por la forma en que el telar responde a sus movimientos.',
          'Un güipil tejido en telar de cintura puede llevar entre 2 y 8 semanas de trabajo, dependiendo de la complejidad del diseño y la finura del hilo. Cada pieza es, por definición, irrepetible.',
        ],
      },
      {
        id: 'telar-pedal',
        title: 'El telar de pedal',
        content: [
          'Introducido durante la colonia española, el telar de pedal es una herramienta más grande y rápida que el telar de cintura. Se usa principalmente para producir cortes (las faldas envolventes que usan las mujeres mayas) y telas más anchas.',
          'A diferencia del telar de cintura, que es portátil y personal, el telar de pedal requiere un espacio dedicado. Muchos talleres familiares en Quetzaltenango, Totonicapán y Salcajá tienen telares de pedal que han pasado por tres o cuatro generaciones.',
        ],
        image: '/image/Cortes.jpg',
        imageAlt: 'Corte guatemalteco tejido en telar de pedal',
      },
      {
        id: 'jaspe',
        title: 'La técnica del jaspe',
        content: [
          'El jaspe es una de las técnicas más complejas del textil guatemalteco. Consiste en teñir los hilos antes de tejerlos, creando patrones que solo se revelan cuando la tela está terminada. Es un proceso que requiere cálculo preciso y visión espacial — la tejedora debe imaginar el diseño final mientras trabaja con hilos que aún no muestran su patrón.',
          'Salcajá, en Quetzaltenango, es considerada la cuna del jaspe guatemalteco. Los cortes jaspeados de esta región son reconocidos en todo el país por su complejidad y belleza.',
        ],
      },
      {
        id: 'bordado',
        title: 'El bordado a mano',
        content: [
          'Además del tejido, muchos güipiles llevan bordados adicionales que se hacen después de terminada la tela base. Estos bordados pueden representar flores, animales, figuras geométricas o escenas narrativas.',
          'En algunos municipios, como Zunil o Santiago Atitlán, los bordados son tan densos que cubren casi toda la superficie del güipil, creando una pieza que es tanto tela como escultura textil.',
        ],
      },
    ],
  },
  {
    id: 'departamentos',
    label: 'Departamentos',
    title: 'Los 22 departamentos de Guatemala y sus tradiciones textiles',
    date: '12 de marzo, 2026',
    readTime: '10 min de lectura',
    headerImage: '/image/Departamentos.jpg',
    headerImageAlt: 'Güipil de Sololá con patrones geométricos del calendario maya',
    intro: [
      'Guatemala tiene 22 departamentos, y cada uno tiene una identidad textil propia. Los colores, los patrones, las técnicas y hasta el tipo de hilo cambian de un lugar a otro. Una persona que conoce la ropa típica puede identificar de dónde es alguien con solo mirar su güipil.',
      'Esta diversidad no es casualidad — es el resultado de siglos de desarrollo cultural independiente entre comunidades mayas que, aunque comparten raíces, desarrollaron estilos propios.',
    ],
    sections: [
      {
        id: 'solola',
        title: 'Sololá — El calendario maya tejido',
        content: [
          'Los güipiles de Sololá son inmediatamente reconocibles por sus patrones geométricos en rojo, morado y azul sobre fondo blanco. Estos patrones no son decorativos — representan elementos del calendario maya sagrado.',
          'Las tejedoras de Sololá trabajan principalmente en telar de cintura, y muchas de las piezas ceremoniales llevan meses de trabajo. El lago de Atitlán, visible desde casi cualquier punto del departamento, influye en los tonos azules que predominan en la paleta.',
        ],
      },
      {
        id: 'quetzaltenango',
        title: 'Quetzaltenango — La capital del jaspe',
        content: [
          'Xela, como se le conoce coloquialmente, es el centro del tejido jaspeado en Guatemala. Los cortes producidos en Salcajá y Quetzaltenango son famosos por sus patrones ikat complejos en tonos oscuros — morados profundos, azules noche, rojos vino.',
          'Los telares de pedal de Quetzaltenango son algunos de los más antiguos del país, y los talleres familiares que los operan llevan generaciones perfeccionando la técnica.',
        ],
        image: '/image/Destacadas 3.jpg',
        imageAlt: 'Corte jaspeado típico de Quetzaltenango',
      },
      {
        id: 'nebaj',
        title: 'Nebaj y el triángulo Ixil',
        content: [
          'El pueblo Ixil, ubicado en el norte de Quiché, tiene una de las tradiciones textiles más resilientes de Guatemala. A pesar de la violencia del conflicto armado interno que devastó la región en los años 80, las tejedoras Ixiles mantuvieron sus técnicas intactas.',
          'Los güipiles de Nebaj se caracterizan por sus bordados densos en colores vibrantes — rojos, amarillos, verdes — sobre fondos blancos o rojos. Cada pieza es un acto de resistencia cultural y orgullo comunitario.',
        ],
      },
      {
        id: 'santiago',
        title: 'Santiago Atitlán — Tradición Tz\'utujil',
        content: [
          'Santiago Atitlán es uno de los pocos lugares donde los hombres todavía usan traje típico diariamente. El pantalón bordado con pájaros y el tzute (paño) en la cabeza son parte de la identidad cotidiana del pueblo Tz\'utujil.',
          'Los güipiles de las mujeres de Santiago son conocidos por sus bordados de pájaros multicolores y figuras que narran historias de la cosmogonía maya.',
        ],
      },
    ],
  },
  {
    id: 'artesanas',
    label: 'Artesanas',
    title: 'Las manos detrás de cada hilo: historias de artesanas guatemaltecas',
    date: '8 de marzo, 2026',
    readTime: '9 min de lectura',
    headerImage: '/image/Artesanas.jpg',
    headerImageAlt: 'Artesana guatemalteca trabajando en telar de cintura',
    intro: [
      'Detrás de cada güipil hay una persona. Una mujer que dedicó semanas de su vida a crear algo irrepetible. En Guatemala, el tejido es trabajo de mujeres — y es un trabajo que durante mucho tiempo fue invisible, mal pagado, y poco valorado fuera de las comunidades que lo producen.',
      'Estas son algunas de las historias que hemos conocido trabajando directamente con artesanas de distintos departamentos del país.',
    ],
    sections: [
      {
        id: 'dona-maria',
        title: 'Doña María — Chichicastenango',
        content: [
          'A sus 62 años, Doña María ha tejido más de 3,000 güipiles. Empezó a los 8 años, aprendiendo de su abuela en un telar de cintura hecho de ramas de encino. Hoy sigue tejiendo todos los días, desde las 5 de la mañana hasta que la luz natural se va.',
          '"Yo no cuento las horas", dice. "Cuento los hilos. Cuando el diseño está listo, el tiempo que tomó no importa — lo que importa es que quedó bien."',
          'Doña María ha formado a más de 40 tejedoras jóvenes en Chichicastenango. Muchas de ellas ahora tienen sus propios talleres. Para ella, enseñar es tan importante como tejer.',
        ],
      },
      {
        id: 'grupo-santa-catarina',
        title: 'El grupo de tejedoras de Santa Catarina Palopó',
        content: [
          'En Santa Catarina Palopó, a orillas del lago de Atitlán, un grupo de 15 mujeres se organizó para tejer de forma colectiva. Comparten materiales, diseños e ideas, pero cada una mantiene su estilo propio.',
          'Lo que empezó como una necesidad económica se convirtió en una comunidad. Se reúnen tres veces por semana, trabajan juntas, y venden juntas. Han logrado establecer precios justos que reflejan el tiempo real que toma cada pieza — algo que individualmente era imposible negociar.',
        ],
        image: '/image/Guipiles.jpeg',
        imageAlt: 'Güipiles coloridos de Santa Catarina Palopó',
      },
      {
        id: 'juventud',
        title: 'La nueva generación',
        content: [
          'No todas las tejedoras son abuelas. Hay una generación joven de mujeres mayas que están reclamando el tejido como forma de expresión contemporánea. Combinan técnicas ancestrales con diseños propios, experimentan con colores no tradicionales, y usan redes sociales para mostrar su trabajo.',
          'Para ellas, tejer no es solo preservar una tradición — es transformarla. Y la plataforma que les permita llegar a un público más amplio, con estándares profesionales, es exactamente lo que necesitan.',
        ],
      },
    ],
  },
  {
    id: 'idiomas',
    label: 'Idiomas',
    title: 'K\'iche\', Kaqchikel, Tz\'utujil: los idiomas detrás del tejido',
    date: '4 de marzo, 2026',
    readTime: '8 min de lectura',
    headerImage: '/image/Idiomas.jpg',
    headerImageAlt: 'Perrajes guatemaltecos con colores que representan distintas comunidades lingüísticas',
    intro: [
      'Guatemala tiene 25 idiomas reconocidos oficialmente: 22 mayas, el xinca, el garífuna y el español. Esta diversidad lingüística no es solo un dato curioso — está directamente relacionada con la diversidad textil del país.',
      'Cada comunidad lingüística desarrolló sus propios nombres para colores, técnicas y patrones. Entender los idiomas mayas es entender por qué la ropa típica varía tanto de un lugar a otro.',
    ],
    sections: [
      {
        id: 'kiche',
        title: 'K\'iche\' — El idioma maya más hablado',
        content: [
          'Con más de un millón de hablantes, el K\'iche\' es el idioma maya más extendido en Guatemala. Se habla en Quiché, Totonicapán, Quetzaltenango, Sololá y Suchitepéquez. Las tejedoras K\'iche\' tienen un vocabulario especializado para describir más de 50 tipos de nudos y tensiones diferentes en el telar.',
          'El Popol Vuh, el libro sagrado maya, fue escrito originalmente en K\'iche\'. En él se describe cómo los dioses creadores "tejieron" el mundo, estableciendo una conexión cosmológica entre el tejido y la creación misma.',
        ],
      },
      {
        id: 'kaqchikel',
        title: 'Kaqchikel — El idioma del altiplano central',
        content: [
          'El Kaqchikel se habla en Chimaltenango, Sacatepéquez y partes de Sololá y Guatemala. Los textiles de la región Kaqchikel se caracterizan por sus diseños florales elaborados y el uso intensivo del bordado sobre la tela base.',
          'En Kaqchikel, la palabra para "tejer" (kemaj) tiene la misma raíz que la palabra para "pensar" (na\'oj kemaj). Tejer es, literalmente, un acto de pensamiento materializado.',
        ],
      },
      {
        id: 'tzutujil',
        title: 'Tz\'utujil — La lengua del lago',
        content: [
          'El Tz\'utujil se habla en las comunidades alrededor del lago de Atitlán, especialmente en Santiago Atitlán, San Pedro La Laguna y San Juan La Laguna. Es uno de los idiomas mayas con menos hablantes, lo que hace que sus textiles sean especialmente valiosos como registros culturales.',
          'Los güipiles Tz\'utujil son narrativos — cuentan historias a través de sus bordados. Pájaros, volcanes, figuras humanas y escenas cotidianas se entrelazan en composiciones que funcionan como crónicas visuales de la comunidad.',
        ],
        image: '/image/Destacadas 4.jpg',
        imageAlt: 'Güipil con bordados narrativos de tradición Tz\'utujil',
      },
      {
        id: 'preservacion',
        title: 'Tejido como preservación lingüística',
        content: [
          'En un contexto donde varios idiomas mayas están en riesgo de desaparecer, los textiles funcionan como una forma de preservación cultural. Los nombres de los patrones, los cantos que acompañan el tejido, y las instrucciones que se transmiten de generación en generación mantienen vivo el vocabulario especializado que no existe en español.',
          'Cuando se pierde un idioma, se pierde también el conocimiento textil que solo existe en ese idioma. Proteger los idiomas mayas es, en parte, proteger el patrimonio textil de Guatemala.',
        ],
      },
    ],
  },
  {
    id: 'tradiciones',
    label: 'Tradiciones',
    title: 'Tradiciones vivas: la ropa típica en la vida cotidiana y ceremonial',
    date: '28 de febrero, 2026',
    readTime: '10 min de lectura',
    headerImage: '/image/Tradiciones.jpg',
    headerImageAlt: 'Textiles guatemaltecos ceremoniales con significado cultural',
    intro: [
      'La ropa típica guatemalteca no vive en un museo — se usa todos los días. En mercados, en bodas, en funerales, en fiestas patronales. Cada ocasión tiene sus propias reglas sobre qué usar, cómo usarlo y qué significa.',
      'Entender estas tradiciones es entender que un güipil no es solo una prenda bonita. Es un sistema de comunicación visual que dice quién sos, de dónde venís y a qué ocasión llegás.',
    ],
    sections: [
      {
        id: 'semana-santa',
        title: 'Semana Santa y los textiles ceremoniales',
        content: [
          'Durante Semana Santa, las comunidades mayas sacan sus mejores prendas. Güipiles que solo se usan una vez al año — piezas que han sido guardadas con cuidado, heredadas de madres y abuelas, y que representan lo más fino del trabajo textil de cada familia.',
          'En Antigua Guatemala, las alfombras de aserrín que decoran las calles durante las procesiones incorporan diseños inspirados en los patrones textiles mayas. Es una fusión de tradiciones que solo existe en Guatemala.',
        ],
      },
      {
        id: 'colores',
        title: 'Los significados ocultos en los colores',
        content: [
          'El rojo no es solo rojo. En la cosmogonía maya, el rojo representa la sangre, la vida, y el este — donde sale el sol. El azul representa el cielo y el agua. El amarillo es el maíz, alimento sagrado. El verde es la naturaleza y la fertilidad. El negro es el oeste, donde muere el sol.',
          'Cuando una tejedora elige los colores de un güipil, no está eligiendo solo una combinación estética. Está construyendo un mensaje. Un güipil ceremonial con predominancia de rojo y amarillo habla de vida y abundancia. Uno con azul y blanco habla de pureza y espiritualidad.',
          'Este conocimiento se transmite oralmente, y no todas las combinaciones son documentadas. Algunas tejedoras mayores guardan "recetas" de color que solo comparten con sus hijas o aprendices más cercanas.',
        ],
        image: '/image/Complementos.jpeg',
        imageAlt: 'Textiles guatemaltecos mostrando la variedad de colores con significado cultural',
      },
      {
        id: 'cotidiano',
        title: 'El uso cotidiano: identidad en cada esquina',
        content: [
          'En los mercados de Chichicastenango, Sololá o San Francisco El Alto, la ropa típica no es una curiosidad — es lo que la gente usa. Las mujeres compran verduras, negocian precios y cargan a sus hijos, todo mientras llevan güipiles que en una tienda de la capital costarían cientos de quetzales.',
          'Para ellas, el güipil no es un lujo ni una declaración de moda. Es la ropa. Y la naturalidad con la que lo llevan es, paradójicamente, lo que lo hace más hermoso.',
        ],
      },
      {
        id: 'futuro',
        title: 'Tradición y futuro: la ropa típica en la moda contemporánea',
        content: [
          'Cada vez más mujeres jóvenes en Guatemala están incorporando piezas típicas en outfits contemporáneos. Un güipil con jeans. Un corte con una blusa moderna. Aretes de chaquira con un vestido de cóctel. Esta fusión no diluye la tradición — la mantiene relevante.',
          'El reto está en que esta fusión se haga con respeto: que se reconozca el origen de la prenda, que se pague un precio justo, y que no se reduzca a "moda étnica" descartable. XAY existe precisamente para cubrir ese espacio.',
        ],
      },
    ],
  },
]

/* ============================================
   Cards de preview para la vista "Todo".
   Se generan a partir de los artículos por categoría.
   ============================================ */
const previewCards = categoryArticles.map((article) => ({
  id: article.id,
  label: article.label,
  title: article.title,
  headerImage: article.headerImage,
  headerImageAlt: article.headerImageAlt,
  readTime: article.readTime,
  intro: article.intro[0],
}))

export default function CulturaPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleCategoryChange = useCallback((categoryId: string) => {
    if (categoryId === activeCategory) return

    // Fade out → cambiar contenido → fade in
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveCategory(categoryId)
      setIsTransitioning(false)

      if (categoryId !== 'all' && contentRef.current) {
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      }
    }, 250)
  }, [activeCategory])

  const activeArticle = categoryArticles.find((a) => a.id === activeCategory)

  return (
    <div>
      {/* ============================================
          HEADER DE SECCIÓN — Siempre visible.
          Título + descripción + pills de categorías.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto">
          {/* Etiqueta con línea */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              Cultura
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* Título + descripción en dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-14">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Historias detrás de cada hilo
            </h1>
            <div className="flex items-end">
              <p
                className="text-base sm:text-lg leading-relaxed max-w-lg"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              >
                Guatemala tiene una de las tradiciones textiles más ricas del mundo.
                Acá exploramos las técnicas, los pueblos, los idiomas y las personas
                que mantienen viva esta herencia cultural.
              </p>
            </div>
          </div>

          {/* Categorías como pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            {/* Pill "Todo" */}
            <button
              onClick={() => setActiveCategory('all')}
              className="shrink-0 px-5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '9999px',
                fontFamily: 'var(--font-body)',
                backgroundColor: activeCategory === 'all' ? 'var(--color-text-primary)' : 'transparent',
                color: activeCategory === 'all' ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                border: activeCategory === 'all' ? '1.5px solid var(--color-text-primary)' : '1.5px solid var(--color-border)',
              }}
            >
              Todo
            </button>
            {categoryArticles.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className="shrink-0 px-5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer"
                style={{
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-body)',
                  backgroundColor: activeCategory === cat.id ? 'var(--color-text-primary)' : 'transparent',
                  color: activeCategory === cat.id ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  border: activeCategory === cat.id ? '1.5px solid var(--color-text-primary)' : '1.5px solid var(--color-border)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CONTENIDO DINÁMICO — Cambia según la pill activa.
          "Todo" → feed de cards con layout variado.
          Categoría → artículo completo en formato blog.
          ============================================ */}
      <div
        ref={contentRef}
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 250ms ease, transform 250ms ease',
        }}
      >
        {activeCategory === 'all' ? (
          /* ==========================================
             VISTA "TODO" — Feed de artículos con
             layouts alternados tipo revista.
             ========================================== */
          <section className="px-6 sm:px-10 lg:px-20 pb-20 sm:pb-28 lg:pb-32">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 lg:gap-8">
              {previewCards.map((card, index) => {
                const pattern = index % 3

                /* Patrón 0: Card horizontal — imagen con texto superpuesto */
                if (pattern === 0) {
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCategoryChange(card.id)}
                      className="group block text-left w-full cursor-pointer"
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '21 / 9' }}
                      >
                        <Image
                          src={card.headerImage}
                          alt={card.headerImageAlt}
                          fill
                          sizes="100vw"
                          priority={index === 0}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to top, rgba(44, 24, 16, 0.8) 0%, rgba(44, 24, 16, 0.1) 60%)' }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className="text-xs uppercase tracking-[0.2em] font-medium"
                              style={{ color: 'var(--color-accent-light)', fontFamily: 'var(--font-body)' }}
                            >
                              {card.label}
                            </span>
                            <span className="text-xs" style={{ color: 'rgba(250, 247, 242, 0.6)' }}>
                              {card.readTime}
                            </span>
                          </div>
                          <h3
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-3xl"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}
                          >
                            {card.title}
                          </h3>
                        </div>
                      </div>
                    </button>
                  )
                }

                /* Patrón 1: Par asimétrico (se renderiza junto con el siguiente) */
                if (pattern === 1) {
                  const nextCard = previewCards[index + 1]
                  return (
                    <div key={card.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                      {/* Card grande */}
                      <button
                        onClick={() => handleCategoryChange(card.id)}
                        className="group lg:col-span-7 block text-left cursor-pointer"
                      >
                        <div
                          className="relative overflow-hidden mb-5"
                          style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '4 / 3' }}
                        >
                          <Image
                            src={card.headerImage}
                            alt={card.headerImageAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </div>
                        <span
                          className="text-xs uppercase tracking-[0.2em] font-medium"
                          style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
                        >
                          {card.label}
                        </span>
                        <h3
                          className="text-xl sm:text-2xl font-bold leading-tight mt-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                        >
                          {card.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                        >
                          {card.readTime}
                        </p>
                      </button>

                      {/* Card chica */}
                      {nextCard && (
                        <button
                          onClick={() => handleCategoryChange(nextCard.id)}
                          className="group lg:col-span-5 block text-left cursor-pointer"
                        >
                          <div
                            className="relative overflow-hidden mb-5"
                            style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '4 / 3' }}
                          >
                            <Image
                              src={nextCard.headerImage}
                              alt={nextCard.headerImageAlt}
                              fill
                              sizes="(max-width: 1024px) 100vw, 42vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          </div>
                          <span
                            className="text-xs uppercase tracking-[0.2em] font-medium"
                            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
                          >
                            {nextCard.label}
                          </span>
                          <h3
                            className="text-xl sm:text-2xl font-bold leading-tight mt-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                          >
                            {nextCard.title}
                          </h3>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                          >
                            {nextCard.readTime}
                          </p>
                        </button>
                      )}
                    </div>
                  )
                }

                /* Patrón 2: ya renderizado con patrón 1 */
                return null
              })}
            </div>
          </section>
        ) : activeArticle ? (
          /* ==========================================
             VISTA ARTÍCULO — Formato blog/editorial.
             Imagen de encabezado + contenido centrado.
             ========================================== */
          <article>
            {/* Imagen de encabezado — ancha pero no full-screen */}
            <div className="px-6 sm:px-10 lg:px-20 pb-10 sm:pb-14">
              <div className="max-w-5xl mx-auto">
                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '21 / 9' }}
                >
                  <Image
                    src={activeArticle.headerImage}
                    alt={activeArticle.headerImageAlt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Contenido editorial — centrado, ancho de lectura */}
            <div className="px-6 sm:px-10 lg:px-20 pb-20 sm:pb-28 lg:pb-32">
              <div className="max-w-2xl mx-auto">
                {/* Fecha y tiempo de lectura */}
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                  >
                    {activeArticle.date}
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)', maxWidth: '40px' }} />
                  <span
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                  >
                    {activeArticle.readTime}
                  </span>
                </div>

                {/* Título del artículo */}
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-10"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  {activeArticle.title}
                </h2>

                {/* Introducción */}
                {activeArticle.intro.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-base sm:text-lg leading-[1.8] mb-6"
                    style={{
                      color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: i === 0 ? 500 : 400,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}

                {/* Separador después de la intro */}
                <div
                  className="my-12 mx-auto"
                  style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-accent)' }}
                />

                {/* Secciones del artículo */}
                {activeArticle.sections.map((section) => (
                  <div key={section.id} className="mb-14">
                    {/* Título de sección */}
                    <h3
                      className="text-xs uppercase tracking-[0.25em] font-medium mb-6"
                      style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
                    >
                      {section.title}
                    </h3>

                    {/* Párrafos */}
                    {section.content.map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-base sm:text-lg leading-[1.8] mb-6"
                        style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                      >
                        {paragraph}
                      </p>
                    ))}

                    {/* Imagen opcional de la sección */}
                    {section.image && (
                      <div
                        className="relative overflow-hidden my-10"
                        style={{ borderRadius: 'var(--radius-md)', aspectRatio: '16 / 9' }}
                      >
                        <Image
                          src={section.image}
                          alt={section.imageAlt || ''}
                          fill
                          sizes="(max-width: 768px) 100vw, 672px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Separador final */}
                <div
                  className="my-12 mx-auto"
                  style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-border)' }}
                />

                {/* Botón volver */}
                <div className="text-center">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors duration-300"
                    style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Ver todos los artículos
                  </button>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>

      {/* ============================================
          CTA — Solo visible en vista "Todo".
          Conecta la sección cultural con la tienda.
          ============================================ */}
      {activeCategory === 'all' && (
        <section
          className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
              >
                Del conocimiento a la acción
              </span>
              <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Cada prenda tiene una historia.{' '}
              <span style={{ color: 'var(--color-accent)' }}>Conocela en persona.</span>
            </h2>
            <p
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Ahora que conocés las técnicas, los orígenes y las manos detrás del tejido,
              explorá las piezas que nacieron de todo ese conocimiento.
            </p>
            <Link
              href="/tienda"
              className="inline-block px-10 py-3.5 text-sm font-medium"
              style={{
                color: 'var(--color-accent)',
                borderRadius: '9999px',
                border: '1.5px solid var(--color-accent)',
                transition: 'background-color 300ms ease, color 300ms ease, border-color 300ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-text-inverse)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-accent)'
              }}
            >
              Explorar la tienda
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
