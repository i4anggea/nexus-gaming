import { escapeHTML } from '../core/utils.js';

const images = ['mouse', 'keyboard', 'headphones', 'console', 'graphics', 'workstation'];

export function renderProductImage(product, { eager = false } = {}) {
  const name = images[product.image];
  return `
    <img
      class="product-photo crop-${product.image}"
      src="assets/${name}-640.webp"
      srcset="assets/${name}-320.webp 320w, assets/${name}-640.webp 640w"
      sizes="(max-width: 767px) 45vw, (max-width: 1100px) 32vw, 440px"
      width="640"
      height="640"
      loading="${eager ? 'eager' : 'lazy'}"
      decoding="async"
      alt="${escapeHTML(`Fotografía de referencia para ${product.name}`)}"
    >
  `;
}
