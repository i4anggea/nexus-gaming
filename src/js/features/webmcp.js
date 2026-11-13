import { addProducts } from '../core/store.js';

export function initWebMCP() {
  if (!document.modelContext?.registerTool) return;
  const lifecycle = new AbortController();
  const tool = {
    name: 'add_demo_products_to_cart',
    description: 'Add example products to the demonstration cart. Does not buy or charge.',
    inputSchema: {
      type: 'object',
      properties: {
        productIds: {
          type: 'array',
          items: { type: 'integer' },
          minItems: 1,
          maxItems: 20,
        },
      },
      required: ['productIds'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      const { count, total } = addProducts(input?.productIds);
      return { count, totalMXN: total };
    },
  };
  try {
    Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal }))
      .catch(() => {});
  } catch {
    // La API es opcional. El carrito sigue disponible mediante la interfaz.
  }
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}
