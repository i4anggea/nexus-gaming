import { signOutDemo } from './js/core/login.js';
import { handleLoginSubmit, handleLoginField, togglePassword } from './js/features/login.js';
import { products } from './js/data/catalog.js';
import {
  addProducts, changeQuantity, completeDemoOrder, getCartSummary, getProduct,
  getState, loadSession, removeProduct, subscribe, toggleFavorite,
} from './js/core/store.js';
import { defaultFilters, filterProducts } from './js/core/filters.js';
import { escapeHTML, money } from './js/core/utils.js';
import { mountIcons } from './js/components/icon.js';
import { closeModal, initModal } from './js/components/modal.js';
import { renderProductImage } from './js/components/product-image.js';
import { showToast } from './js/components/toast.js';
import { clearFilter, initCatalog, renderCatalog, resetFilters } from './js/features/catalog.js';
import { initFeatured, selectFeaturedTab } from './js/features/featured.js';
import { initRouter, navigateToCatalog } from './js/features/router.js';
import { initWebMCP } from './js/features/webmcp.js';
import {
  changeComparison, selectComparison, showAccount, showAdmin, showCart, showCheckout,
  showCompare, showCredits, showDetail, showFavorites, showHelp, showMenu,
  showOrderConfirmation, showSearch, showSetup,
} from './js/features/dialogs.js';

function refreshState() {
  const { favorites } = getState();
  document.querySelector('#cart-count').textContent = getCartSummary().count;
  document.querySelectorAll('[data-favorite]').forEach((button) => {
    const selected = favorites.includes(Number(button.dataset.favorite));
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

const actions = {
  search: showSearch,
  favorites: () => { showFavorites(); refreshState(); },
  cart: () => showCart(),
  account: showAccount,
  logout: () => { signOutDemo(); showAccount(); showToast('Sesión demo cerrada'); },
  'toggle-password': togglePassword,
  admin: showAdmin,
  setup: showSetup,
  compare: () => showCompare(),
  checkout: showCheckout,
  menu: showMenu,
  credits: showCredits,
  continue: () => {
    closeModal();
    navigateToCatalog();
  },
};

/** Un único controlador de clics permite usar componentes creados dinámicamente. */
function handleClick(event) {
  const button = event.target.closest('button, a');
  if (!button) return;
  const data = button.dataset;

  if (data.action && Object.hasOwn(actions, data.action)) {
    event.preventDefault();
    actions[data.action]();
  }
  if (button.hasAttribute('data-close')) closeModal();

  if (data.add) {
    const id = Number(data.add);
    try {
      addProducts([id]);
      showToast(`${getProduct(id).name} agregado al carrito`);
    } catch (error) {
      showToast(error.message);
    }
  }
  if (data.detail) showDetail(Number(data.detail));
  if (data.compare) selectComparison(Number(data.compare));

  if (data.favorite) {
    const selected = toggleFavorite(Number(data.favorite));
    showToast(selected ? 'Guardado en favoritos' : 'Eliminado de favoritos');
    if (document.querySelector('#modal-label').textContent === 'TU SELECCIÓN') {
      showFavorites({ preserveFocus: true });
      refreshState();
    }
  }
  if (data.category) {
    resetFilters({ category: data.category });
    event.preventDefault();
    navigateToCatalog();
  }
  if (data.tab) selectFeaturedTab(button, refreshState);

  if (data.qty) {
    changeQuantity(Number(data.qty), Number(data.delta));
    showCart({ preserveFocus: true });
  }
  if (data.remove) {
    removeProduct(Number(data.remove));
    showCart();
    document.querySelector('#close-modal').focus();
  }
  if (data.help) showHelp(data.help);
  if (data.clearFilter) clearFilter(data.clearFilter);
  if (button.hasAttribute('data-reset-filters')) resetFilters();

  if (button.id === 'offer-link') {
    event.preventDefault();
    resetFilters({ offers: true });
    navigateToCatalog();
  }
}

function handleChange(event) {
  const input = event.target;
  if (input.hasAttribute('data-compare-select')) {
    changeComparison(Number(input.dataset.compareSelect), Number(input.value));
  }
  if (input.closest('#setup-form')) {
    const total = [...document.querySelectorAll('#setup-form select')].reduce((sum, select) => (
      sum + (getProduct(Number(select.value))?.price || 0)
    ), 0);
    document.querySelector('#setup-total').textContent = `${money(total)} MXN`;
  }
}

function handleSearch(event) {
  if (event.target.id !== 'global-search') return;
  const query = event.target.value.trim();
  const matches = query ? filterProducts(products, { ...defaultFilters, query }) : [];
  document.querySelector('#search-count').textContent = query
    ? `${matches.length} resultados`
    : 'Escribe un nombre, categoría o especificación.';
  document.querySelector('#search-results').innerHTML = matches.map((product) => `
    <button type="button" class="cart-line search-result" data-detail="${product.id}">
      ${renderProductImage(product)}
      <span class="line-info">
        <strong>${escapeHTML(product.name)}</strong><br>
        <small>${money(product.price)} MXN</small>
      </span>
      <span aria-hidden="true">↗</span>
    </button>
  `).join('');
}

function handleSubmit(event) {
  const form = event.target;
  if (form.id === 'login-form') {
    event.preventDefault();
    handleLoginSubmit(form, () => { showAccount(); showToast('Sesión demo iniciada'); });
    return;
  }
  if (form.id === 'setup-form') {
    event.preventDefault();
    const ids = [...form.querySelectorAll('select')]
      .map((select) => Number(select.value))
      .filter(Boolean);
    if (!ids.length) return showToast('Elige al menos una pieza para tu setup');
    addProducts(ids);
    showCart();
    showToast('Tu setup está en el carrito');
  }
  if (form.id === 'checkout-form') {
    event.preventDefault();
    if (!form.reportValidity()) return;
    showOrderConfirmation(completeDemoOrder());
  }
  if (form.id === 'newsletter') {
    event.preventDefault();
    document.querySelector('#newsletter-status').textContent =
      'Vista previa: tu correo es válido. La suscripción se activará en la versión comercial.';
    document.querySelector('#email').value = '';
  }
}

function init() {
  document.documentElement.classList.replace('no-js', 'js');
  loadSession();
  subscribe(refreshState);
  mountIcons();
  initModal();
  initCatalog(refreshState);
  initFeatured();
  initRouter();
  initWebMCP();
  refreshState();
  renderCatalog();

  document.addEventListener('click', handleClick);
  document.addEventListener('change', handleChange);
  document.addEventListener('input', handleSearch);
  document.addEventListener('input', handleLoginField);
  document.addEventListener('focusout', handleLoginField);
  document.addEventListener('submit', handleSubmit);
}

init();
