# Auditoría técnica — 5 de octubre de 2026

Alcance: fuentes completas, salida estática y flujos interactivos de la versión demostrativa. Se mantiene la dirección editorial e industrial solicitada más recientemente. No se conectan pagos, cuentas ni formularios a servicios externos.

## Hallazgos y correcciones

| Área | Hallazgo inicial | Corrección |
|---|---|---|
| Estructura · media | HTML, CSS y JS comprimidos en archivos difíciles de mantener | Fuentes legibles, construcción reproducible y salida legible |
| Componentes · media | Secciones mezcladas y lógica comercial en un único archivo | Ocho secciones HTML independientes; layout y catálogo separados; JS por responsabilidad |
| Responsive · media | Metadata de 7–10 px y controles pequeños; tabla de comparación ancha | Metadata mínima de 11 px, controles principales de 44 px y tabla desplazable por teclado |
| Accesibilidad · alta | Diálogo sin nombre; pestañas ARIA incompletas; foco perdido al actualizar vistas | Nombre accesible, relación tab/panel, tabindex móvil, flechas/Home/End y restauración de foco |
| Accesibilidad · media | Falta de salto al contenido; jerarquía de headings irregular; foco del correo poco claro | Skip link, catálogo dentro de main, headings de producto y pie, foco visible compartido |
| Performance · media | Fotografías JPG y productos mediante fondos CSS | WebP responsive, imágenes HTML con carga diferida, dimensiones y hero prioritario |
| SEO · media | Contenido de productos dependiente de JS y metadatos incompletos | Productos y categorías construidos en HTML, canonical, Open Graph, idioma y títulos por vista |
| Design System · media | Tamaños y colores dispersos | Tokens compartidos y estilos separados por sección; se conserva la nueva identidad serif |
| Hover/focus · media | Targets y estados no uniformes | Estados existentes conservados; contorno de foco y targets compartidos; foco tras cerrar diálogo |
| Animaciones · baja | Riesgo de movimiento innecesario | Se conservan transiciones discretas y se elimina movimiento con prefers-reduced-motion |
| Errores · alta | sessionStorage sin validar; datos manipulados podían romper la sesión o entrar en HTML | Saneamiento de IDs, cantidades y pedidos; escape de HTML; fallback en memoria |
| Errores · media | Rangos invertidos, filtros inconsistentes y rerender de diálogo | Validación con aria-invalid, motor común de filtros y conservación de foco en cantidad/comparador |

## Evidencia de verificación

- Ocho pruebas automatizadas: búsqueda con tildes, combinación de filtros, rangos inválidos, ordenación sin mutaciones, datos guardados manipulados, adición atómica, totales/pedido demo y escape de HTML.
- Verificación de sintaxis de todos los módulos JS, IDs HTML únicos, componentes resueltos y existencia de recursos e imports locales.
- Portada y catálogo revisados a 320, 390, 768, 1024 y 1440 px: sin desbordamiento horizontal de documento en esas anchuras.
- Pestañas: ArrowRight cambia selección y foco. Comparador: cambio mediante teclado conserva el foco; Escape devuelve el foco al disparador.
- Filtros combinados: periféricos, precio máximo 2200, valoración ≥ 4.8 y conexión inalámbrica devuelven dos productos. Rango invertido anuncia el error y permite restablecer.
- Carrito: aumentar cantidad conserva el foco y actualiza el total. Checkout completo con datos ficticios produce NX-DEMO-0001 por $2,998, sin cargos.
- No aparecieron errores de consola durante esos flujos.
- Recursos fotográficos: originales 895,625 bytes; conjunto completo WebP con variantes 341,280 bytes, aproximadamente 62% menos. Esto compara archivos, no constituye una medición de transferencia ni una puntuación de Core Web Vitals.

## Límites y trabajo posterior

- La tienda sigue siendo una demostración. Cuenta, admin, newsletter y checkout no tienen backend ni autenticación real.
- El sitio conserva el acceso privado existente: los metadatos no hacen que los buscadores puedan indexarlo. Las vistas mediante hash no ofrecen URLs independientes de producto.
- Google Fonts es una dependencia externa con display=swap y preconnect. No se han autoalojado las fuentes.
- Las fotos son referencias reales compartidas entre algunos modelos demo; no representan un inventario comercial verificado.
- No se ejecutó Lighthouse ni una certificación completa WCAG. La revisión por teclado, semántica y tamaños no sustituye pruebas con lectores de pantalla, distintos motores y métricas de campo.
- No se añaden datos estructurados comerciales a productos ficticios. Para una tienda real se necesitan inventario, disponibilidad, fichas con URLs propias, pagos y políticas verificadas.
