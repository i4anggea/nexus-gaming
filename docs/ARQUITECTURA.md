# Arquitectura de NEXUS

## Composición de la página

| Parte | Componente HTML | Estilos |
|---|---|---|
| Navegación | `layout/header.html` | `navigation.css` |
| 01 · Hero editorial | `sections/hero.html` | `hero.css` |
| 02 · Índice de categorías | `sections/categories.html` | `categories.css` |
| 03 · Productos seleccionados | `sections/featured.html` | `products.css` |
| 04 · Configura tu setup | `sections/setup.html` | `setup.css` |
| 05 · Comparación | `sections/comparison.html` | `comparison.css` |
| 06 · Promoción | `sections/promotion.html` | `promotion.css` |
| 07 · Criterio de compra | `sections/benefits.html` | `benefits.css` |
| 08 · Newsletter demo | `sections/newsletter.html` | `newsletter.css` |
| Catálogo | `views/catalog.html` | `catalog.css` |
| Pie | `layout/footer.html` | `footer.css` |
| Diálogo compartido | `layout/modal.html` | `dialogs.css` |

Las rutas de componentes parten de `src/components/`; las de estilos, de `src/styles/`. Cada sección conserva su composición visual. `src/index.html` contiene el esqueleto semántico y las inclusiones en el orden de lectura.

## Construcción

`scripts/build.mjs` ensambla los componentes HTML, genera el contenido inicial de productos y categorías, agrupa los estilos en un orden explícito y copia módulos y recursos a `dist`. No descarga librerías ni crea componentes al cargar el navegador. Esto evita una portada vacía cuando JavaScript falla.

Los estilos empiezan por `tokens.css` y `base.css`, continúan con los módulos visuales y terminan con `responsive.css` y `accessibility.css`. La última capa reúne reglas compartidas de foco, tamaño de controles, contenido sin JavaScript y movimiento reducido.

## JavaScript

| Módulo | Responsabilidad |
|---|---|
| `src/app.js` | Inicialización y delegación de eventos; conecta acciones con funcionalidades |
| `data/catalog.js` | Catálogo de ejemplo y categorías |
| `data/icons.js`, `data/help.js` | Iconos y textos de ayuda |
| `core/store.js` | Estado validado, carrito, favoritos, pedidos y suscriptores |
| `core/filters.js` | Búsqueda normalizada, filtros combinables y ordenación, sin DOM |
| `core/utils.js` | Escape de HTML y formato de moneda |
| `components/` | Imagen, producto, categorías, iconos, diálogo y avisos |
| `features/catalog.js` | Campos, filtros activos, resultados y rangos inválidos |
| `features/featured.js` | Pestañas y navegación por teclado |
| `features/router.js` | Portada/catálogo, título, navegación activa y foco |
| `features/dialogs.js` | Vistas de detalle, carrito, comparación, setup, checkout y cuenta demo |
| `features/webmcp.js` | Integración opcional con el mismo carrito validado |

El estado es la única fuente de verdad. Los componentes reciben datos para producir HTML; la lógica comercial no depende de selectores CSS. El catálogo y el buscador global comparten la misma función de filtrado. Los textos interpolados se escapan antes de entrar en HTML.

## Lenguaje visual

La última dirección de arte prevalece sobre el sistema oscuro inicial: papel, tinta y lima; titulares Instrument Serif, textos DM Sans y captions DM Mono; esquinas rectas, líneas y composiciones asimétricas. Los tokens centralizan estas decisiones. Los breakpoints conservan los cambios de composición existentes, mientras las reglas compartidas garantizan metadata de al menos 11 px y controles principales de 44 px.

## Cómo añadir una sección

1. Crea su componente en `src/components/sections/` y su hoja en `src/styles/`.
2. Incluye el marcador en `src/index.html`.
3. Registra el componente y el orden de estilos en `scripts/build.mjs`.
4. Si tiene interacción, crea un módulo en `src/js/features/` y conéctalo desde `src/app.js`.
5. Construye y verifica con los comandos del README.
