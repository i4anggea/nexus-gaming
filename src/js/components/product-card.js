import { escapeHTML, money } from '../core/utils.js';
import { renderIcon } from './icon.js';
import { renderProductImage } from './product-image.js';

export function renderProductCard(product) {
  const name = escapeHTML(product.name);
  const badgeLabels = {
    'BEST SELLER': 'FAVORITO',
    NEW: 'NUEVO',
    SALE: 'PRECIO ESPECIAL',
  };
  const badge = product.badge
    ? `<span class="badge ${product.old ? 'sale' : ''}">${badgeLabels[product.badge]}</span>`
    : '';

  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <button
          type="button"
          class="icon-btn favorite"
          data-favorite="${product.id}"
          aria-label="Guardar ${name} en favoritos"
          aria-pressed="false"
        >
          ${renderIcon('heart')}
        </button>
        ${badge}
        <button type="button" class="image-link" data-detail="${product.id}" aria-label="Ver ${name}">
          ${renderProductImage(product)}
        </button>
      </div>
      <div class="product-info">
        <div class="product-brand">NX / ${String(product.id).padStart(3, '0')} — ${escapeHTML(product.category.toUpperCase())}</div>
        <h3 class="product-heading">
          <button type="button" class="product-name" data-detail="${product.id}">${name}</button>
        </h3>
        <div class="rating">
          <span aria-hidden="true">★</span>
          <span class="sr-only">Valoración:</span> ${product.rating}
          <small>/ ${product.reviews} valoraciones demo</small>
        </div>
        <div class="price-row">
          <div class="price">
            ${money(product.price)} <small>MXN</small>
            ${product.old ? `<span class="old-price"><span class="sr-only">Precio anterior:</span>${money(product.old)}</span>` : ''}
          </div>
          <button type="button" class="icon-btn add-cart" data-add="${product.id}" aria-label="Agregar ${name} al carrito">
            ${renderIcon('bag')}
          </button>
        </div>
        <button type="button" class="compare-small" data-compare="${product.id}" aria-label="Comparar ${name}">[ + ] Comparar</button>
      </div>
    </article>
  `;
}
