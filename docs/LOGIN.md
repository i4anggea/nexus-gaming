# Login demostrativo con patterns

Se accede desde Cuenta, Cuenta / pedidos o Mi cuenta en el menú móvil.

## Datos de ejemplo

- Usuario: `gamer_demo`
- Contraseña: `Nexus2026`

Son credenciales públicas de demostración. No introduzcas contraseñas reales. No se envían datos a un servidor ni se guardan contraseñas. El usuario de ejemplo solo permanece en memoria hasta cerrar sesión o recargar la página. Este login no protege datos ni sustituye una autenticación de producción.

## Patrones HTML

Usuario: `[A-Za-z][A-Za-z0-9_]{3,19}`

Empieza por una letra y admite después letras, números o guion bajo. Longitud total: 4–20 caracteres.

Contraseña: `(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,32}`

Las tres comprobaciones anticipadas exigen minúscula, mayúscula y número. La última parte limita el ejemplo a letras y números y a 8–32 caracteres. Es una regla didáctica, no una política recomendada para contraseñas reales.

Ambos inputs contienen `required`, `minlength`, `maxlength` y `pattern`. La definición de las reglas vive en `src/js/core/login.js` y el componente usa esa misma definición para evitar discrepancias entre HTML y JavaScript.

## Validación

El formulario utiliza `novalidate` para mostrar errores personalizados y accesibles en lugar de depender de las burbujas de error del navegador. Los atributos HTML siguen exponiendo su estado mediante la API de validación nativa.

JavaScript valida campos obligatorios y patrones al enviar. Después de salir de un campo o de intentar enviar, también corrige su estado al escribir. Cada error se asocia a su input mediante `aria-describedby`; `aria-invalid` identifica el estado. El envío enfoca el primer campo inválido y anuncia un resumen mediante una región de estado.

La validación de formato y la comprobación de credenciales son pasos diferentes: `otro_usuario` y `Otra2026` cumplen los patrones, pero no coinciden con la cuenta ficticia y no inician sesión.

El botón Mostrar contraseña cambia el tipo de input y comunica su estado con `aria-pressed`. Cerrar sesión devuelve al formulario sin borrar carrito ni favoritos.

## Archivos

- `src/js/core/login.js`: reglas, validación y usuario demo en memoria.
- `src/js/components/login-form.js`: marcado del formulario.
- `src/js/features/login.js`: errores, foco y mostrar contraseña.
- `src/js/features/dialogs.js`: formulario y cuenta en el diálogo existente.
- `src/app.js`: eventos y coordinación.
- `src/styles/login.css`: estilos compartidos con la identidad editorial.
- `tests/login.test.js`: formatos inválidos, límites y acceso ficticio.
