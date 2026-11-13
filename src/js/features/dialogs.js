import { getDemoUser } from '../core/login.js';
import { renderLoginForm } from '../components/login-form.js';
import { products } from '../data/catalog.js';
import { help } from '../data/help.js';
import { getState, getCartSummary, getProduct } from '../core/store.js';
import { escapeHTML, money } from '../core/utils.js';
import { openModal } from '../components/modal.js';
import { renderIcon } from '../components/icon.js';
import { renderProductImage } from '../components/product-image.js';
import { renderProductCard } from '../components/product-card.js';

let comparisonIds = [1, 7];

export function showCart({ preserveFocus = false } = {}) {
  const { cart } = getState();
  const items = products.filter((product) => cart[product.id]);
  const { total } = getCartSummary();
  const lines = items.map((product) => `
    <div class="cart-line">
      ${renderProductImage(product)}
      <div class="line-info">
        <strong>${escapeHTML(product.name)}</strong><br>
        <small>${money(product.price)} MXN</small>
      </div>
      <div class="qty">
        <button type="button" data-qty="${product.id}" data-delta="-1" aria-label="Reducir cantidad de ${escapeHTML(product.name)}">−</button>
        <span aria-label="Cantidad">${cart[product.id]}</span>
        <button type="button" data-qty="${product.id}" data-delta="1" aria-label="Aumentar cantidad de ${escapeHTML(product.name)}">+</button>
      </div>
      <button type="button" class="icon-btn" data-remove="${product.id}" aria-label="Eliminar ${escapeHTML(product.name)}">${renderIcon('close')}</button>
    </div>
  `).join('');

  openModal('TU CARRITO', `
    <h2>Tu próximo level up.</h2>
    ${items.length ? `
      ${lines}
      <div class="summary"><span>Total</span><strong>${money(total)} MXN</strong></div>
      <p>Compra demostrativa. No se realizarán cargos ni envíos.</p>
      <div class="modal-actions">
        <button type="button" class="button primary" data-action="checkout">Continuar al checkout ↗</button>
        <button type="button" class="button secondary" data-action="continue">Seguir explorando</button>
      </div>
    ` : `
      <div class="empty">Tu carrito está listo para tu primer upgrade.</div>
      <div class="modal-actions">
        <button type="button" class="button primary" data-action="continue">Explorar productos ↗</button>
      </div>
    `}
  `, { preserveFocus });
}

export function showDetail(id) {
  const product = getProduct(id);
  if (!product) return;
  openModal('FICHA DE PRODUCTO', `
    <div class="detail-grid">
      ${renderProductImage(product, { eager: true })}
      <div>
        <p class="eyebrow">${escapeHTML(product.brand)} / ${escapeHTML(product.category)}</p>
        <h2>${escapeHTML(product.name)}</h2>
        <div class="rating">★ ${product.rating} · ${product.reviews} valoraciones de ejemplo</div>
        <p>Revisa la ficha técnica y compara esta pieza con el resto de tu selección.</p>
        <div class="price">${money(product.price)} <small>MXN</small></div>
        <table class="spec-table">
          <caption class="sr-only">Especificaciones de ${escapeHTML(product.name)}</caption>
          <tbody>
            ${Object.entries(product.specs).map(([key, value]) => `
              <tr><th scope="row">${escapeHTML(key)}</th><td>${escapeHTML(value)}</td></tr>
            `).join('')}
          </tbody>
        </table>
        <p>Ficha, precio y valoraciones de demostración. Fotografía real de referencia.</p>
        <div class="modal-actions">
          <button type="button" class="button primary" data-add="${product.id}">Agregar al carrito</button>
          <button type="button" class="button secondary" data-compare="${product.id}">Comparar</button>
        </div>
      </div>
    </div>
  `);
}

export function showFavorites({ preserveFocus = false } = {}) {
  const { favorites } = getState();
  openModal('TU SELECCIÓN', `
    <h2>Tus favoritos.</h2>
    <div class="product-grid">
      ${favorites.length
        ? products.filter((product) => favorites.includes(product.id)).map(renderProductCard).join('')
        : '<div class="empty">Guarda los productos que te gustan con el corazón.</div>'}
    </div>
  `, { preserveFocus });
}

export function showCompare({ preserveFocus = false } = {}) {
  const selection = comparisonIds.map(getProduct);
  const [first, second] = selection;
  const keys = [...new Set([...Object.keys(first.specs), ...Object.keys(second.specs)])];
  const select = (product, index) => `
    <label>
      Producto ${index + 1}
      <select data-compare-select="${index}">
        ${products.map((option) => `
          <option value="${option.id}" ${product.id === option.id ? 'selected' : ''}>${escapeHTML(option.name)}</option>
        `).join('')}
      </select>
    </label>
  `;

  openModal('COMPARADOR', `
    <h2>Elige con claridad.</h2>
    <p>Selecciona dos productos. Las especificaciones son de ejemplo.</p>
    <div class="setup-form">${selection.map(select).join('')}</div>
    <div class="compare-objects">
      ${selection.map((product) => `
        <div>${renderProductImage(product)}<strong>${escapeHTML(product.name)}</strong></div>
      `).join('')}
    </div>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Tabla comparativa">
      <table class="spec-table">
        <caption class="sr-only">Comparación de productos</caption>
        <thead><tr><th scope="col">Característica</th><th scope="col">${escapeHTML(first.name)}</th><th scope="col">${escapeHTML(second.name)}</th></tr></thead>
        <tbody>
          ${keys.map((key) => `
            <tr><th scope="row">${escapeHTML(key)}</th><td>${escapeHTML(first.specs[key] || '—')}</td><td>${escapeHTML(second.specs[key] || '—')}</td></tr>
          `).join('')}
          <tr><th scope="row">Valoración</th><td>★ ${first.rating}</td><td>★ ${second.rating}</td></tr>
          <tr><th scope="row">Precio MXN</th><td>${money(first.price)}</td><td>${money(second.price)}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="modal-actions">
      ${selection.map((product, index) => `
        <button type="button" class="button ${index === 0 ? 'primary' : 'secondary'}" data-add="${product.id}">Agregar ${escapeHTML(product.name)}</button>
      `).join('')}
    </div>
  `, { preserveFocus });
}

export function selectComparison(id) {
  if (!getProduct(id)) return;
  if (!comparisonIds.includes(id)) comparisonIds = [comparisonIds[1], id];
  showCompare();
}

export function changeComparison(index, id) {
  if (![0, 1].includes(index) || !getProduct(id)) return;
  comparisonIds[index] = id;
  showCompare({ preserveFocus: true });
}

export function showSetup() {
  const slots = [
    ['Monitor', [6]],
    ['Teclado', [2, 8]],
    ['Mouse', [1, 7]],
    ['Headset', [3]],
    ['PC / componente', [5]],
  ];
  openModal('CONFIGURADOR DE SETUP', `
    <h2>Tu setup empieza aquí.</h2>
    <p>Combina tu selección. Puedes dejar piezas pendientes.</p>
    <form id="setup-form" class="setup-form">
      ${slots.map(([label, ids]) => `
        <label>${label}
          <select name="piece">
            <option value="0">Elegir después</option>
            ${ids.map((id) => {
              const product = getProduct(id);
              return `<option value="${id}">${escapeHTML(product.name)} · ${money(product.price)}</option>`;
            }).join('')}
          </select>
        </label>
      `).join('')}
      <div class="full">
        <div class="summary"><span>Total</span><strong id="setup-total" role="status">$0 MXN</strong></div>
        <button class="button primary" type="submit">Agregar mi setup al carrito</button>
      </div>
    </form>
  `);
}

export function showCheckout() {
  const summary = getCartSummary();
  if (!summary.count) return showCart();
  openModal('CHECKOUT DEMOSTRATIVO', `
    <h2>Un paso más para tu upgrade.</h2>
    <p>Compra simulada: sin tarjeta ni cargos. Usa datos ficticios.</p>
    <form id="checkout-form" class="checkout-form">
      <label>Nombre de ejemplo<input required name="name" placeholder="Alex Gamer" autocomplete="off" maxlength="80"></label>
      <label>Correo de ejemplo<input type="email" required name="email" placeholder="alex@example.com" autocomplete="off"></label>
      <label class="full">Dirección de ejemplo<input required name="address" placeholder="Calle del Setup 123" autocomplete="off" maxlength="160"></label>
      <label>Ciudad<input required name="city" placeholder="Ciudad de México" autocomplete="off"></label>
      <label>Código postal<input required name="postal" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" placeholder="01000" autocomplete="off"></label>
      <div class="full">
        <div class="summary"><span>Total simulado</span><strong>${money(summary.total)} MXN</strong></div>
        <button class="button primary" type="submit">Simular pedido</button>
      </div>
    </form>
  `);
}

export function showOrderConfirmation(order) {
  openModal('PEDIDO SIMULADO', `
    <p class="eyebrow">SIMULACIÓN COMPLETADA</p>
    <h2>Tu recorrido está completo.</h2>
    <p>Pedido ${escapeHTML(order.id)} · ${money(order.total)} MXN</p>
    <p>No se ha realizado ningún cargo ni se enviarán productos. El pedido permanece en esta sesión.</p>
    <button type="button" class="button primary" data-action="account">Ver mis pedidos</button>
  `);
}

export function showAccount() {
  if (!getDemoUser()) {
    openModal('LOGIN / DEMOSTRACIÓN', renderLoginForm());
    document.querySelector('#login-username').focus();
    return;
  }
  const { orders } = getState();
  openModal('TU ESPACIO NEXUS', `
    <h2>Hola, ${escapeHTML(getDemoUser())}.</h2>
    <p>Favoritos y pedidos simulados de esta sesión. El registro y las direcciones se conectarán en la versión comercial.</p>
    <div class="modal-actions">
      <button type="button" class="button secondary" data-action="favorites">Mis favoritos</button>
      <button type="button" class="button secondary" data-action="cart">Mi carrito</button>
      <button type="button" class="button secondary" data-action="admin">Ver panel demo</button>
      <button type="button" class="button secondary" data-action="logout">Cerrar sesión demo</button>
    </div>
    <h3 class="account-orders-title">Mis pedidos</h3>
    ${orders.length ? orders.map((order) => `
      <div class="cart-line">
        <div class="line-info"><strong>${escapeHTML(order.id)}</strong><br><small>${order.count} productos · ${money(order.total)} MXN</small></div>
        <span>Simulado</span>
      </div>
    `).join('') : '<div class="empty">Todavía no hay pedidos simulados.</div>'}
  `);
}

export function showAdmin() {
  const { orders } = getState();
  openModal('ADMIN / DEMO', `
    <h2>Control de tu tienda.</h2>
    <p>Inventario de ejemplo y pedidos de esta sesión. No es un panel administrativo de producción.</p>
    <div class="setup-form">
      <div class="empty"><h3>${products.length}</h3>Productos de ejemplo</div>
      <div class="empty"><h3>${orders.length}</h3>Pedidos simulados</div>
    </div>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Inventario de demostración">
      <table class="spec-table">
        <caption class="sr-only">Inventario de demostración</caption>
        <thead><tr><th scope="col">Producto</th><th scope="col">Precio MXN</th><th scope="col">Inventario demo</th></tr></thead>
        <tbody>${products.map((product) => `<tr><td>${escapeHTML(product.name)}</td><td>${money(product.price)}</td><td>Disponible</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `);
}

export function showSearch() {
  openModal('BUSCAR EN NEXUS', `
    <h2>¿Qué estás buscando?</h2>
    <label class="sr-only" for="global-search">Buscar en el catálogo</label>
    <input class="modal-search" id="global-search" type="search" placeholder="Mouse, teclado, consola…">
    <p id="search-count" role="status"></p>
    <div id="search-results"></div>
  `);
  document.querySelector('#global-search').focus();
}

export function showHelp(topic) {
  if (!Object.hasOwn(help, topic)) return;
  openModal('NEXUS / AYUDA', `<h2>${escapeHTML(topic)}</h2><p>${escapeHTML(help[topic])}</p>`);
}

export function showMenu() {
  const links = [
    ['Inicio', 'inicio'], ['Catálogo', 'tienda'], ['El índice', 'categorias'],
    ['El setup', 'setup'], ['Precio especial', 'ofertas'], ['Criterio NEXUS', 'nosotros'],
  ];
  openModal('NEXUS / NAVEGACIÓN', `
    <h2>Tu siguiente nivel.</h2>
    <nav class="menu-links" aria-label="Navegación móvil">
      ${links.map(([label, hash]) => `<a class="button secondary" href="#${hash}" data-close>${label} ↗</a>`).join('')}
    </nav>
    <div class="modal-actions">
      <button type="button" class="button secondary" data-action="favorites">Favoritos</button>
      <button type="button" class="button secondary" data-action="account">Mi cuenta</button>
    </div>
  `);
}

export function showCredits() {
  const credits = [
    ['black-flat-screen-computer-monitor-turned-on-displaying-desktop-fewhfXbCUzI', 'Estación de juego — Jack B'],
    ['a-keyboard-and-mouse-on-a-desk-KKprtFExl7c', 'Escritorio y teclado — Gilang Ramadhan'],
    ['a-computer-mouse-sitting-on-top-of-a-black-surface-1sOMh1E9WrM', 'Mouse — wtrsnvc'],
    ['a-pair-of-headphones-sitting-on-top-of-a-table-q7ZfVmvB49c', 'Auriculares — Jason Leung'],
    ['a-close-up-of-two-video-game-controllers-DYDIF2OuavM', 'Consola — Triyansh Gill'],
    ['black-and-silver-round-device-ts17B8i4Mog', 'Tarjeta gráfica — Unsplash'],
  ];
  openModal('FOTOGRAFÍA / CRÉDITOS', `
    <h2>Detrás de las imágenes.</h2>
    <p>Fotografías reales de referencia para el catálogo de demostración.</p>
    <div class="credits-list">
      ${credits.map(([slug, name]) => `<a href="https://unsplash.com/photos/${slug}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join('')}
    </div>
  `);
}
