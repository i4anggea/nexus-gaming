# NEXUS Gaming — demostración

Tienda editorial de hardware. Catálogo, filtros, favoritos, comparador, configurador y pedidos simulados. No procesa pagos, no envía formularios a un servidor y no autentica usuarios.

## Trabajo local

Requiere Node.js 18 o posterior. La construcción no instala dependencias.

```sh
npm run build
npm test
npm run check
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abre http://127.0.0.1:4173. Los módulos JavaScript necesitan un servidor HTTP; abrir el HTML como archivo no funciona.

## Dónde editar

- `src/index.html`: estructura general y orden de los componentes.
- `src/components/sections/`: ocho secciones independientes de la portada.
- `src/components/layout/`: navegación, pie y diálogo compartido.
- `src/components/views/catalog.html`: catálogo con filtros.
- `src/styles/`: tokens, estilos por sección, responsive y accesibilidad.
- `src/app.js`: inicialización y coordinación de eventos.
- `src/js/`: datos, estado, filtros, componentes reutilizables y funcionalidades.
- `public/assets/`: fotografías WebP listas para servir.
- `assets/source/`: originales de las fotografías, fuera del directorio publicado.

`dist/index.html`, `dist/style.css` y `dist/app.js` son salidas legibles generadas. Edita las fuentes y vuelve a construir; cambiar directamente `dist` se pierde en la siguiente construcción.

La sesión se guarda en `sessionStorage` bajo `nexus-demo`, validando los datos recuperados. El navegador conserva la sesión dentro de la pestaña; no es una base de datos.

El apartado Cuenta incluye un login ficticio con patrones HTML y errores accesibles. Datos de ejemplo: `gamer_demo` / `Nexus2026`. Consulta [Login y validaciones](docs/LOGIN.md).

Consulta [Arquitectura](docs/ARQUITECTURA.md) y [Auditoría](docs/AUDITORIA.md).

## Fotografías

Los créditos y enlaces originales se mantienen en el diálogo «Créditos fotográficos». Para regenerar las variantes, ejecuta `python3 scripts/optimize-images.py`; ese paso opcional requiere Pillow.
