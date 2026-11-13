import { products } from '../data/catalog.js';
import { defaultFilters, filterProducts, validRange } from '../core/filters.js';
import { escapeHTML, money } from '../core/utils.js';
import { renderProductCard } from '../components/product-card.js';

let filters = { ...defaultFilters };
let onRender = () => {};
const query = (selector) => document.querySelector(selector);
const fields = {
  query: '#shop-search', category: '#category-filter',
  min: '#price-min', max: '#price-max',
  offers: '#offers-filter', rating: '#rating-filter',
  wireless: '#wireless-filter', sort: '#sort-filter',
};
const priceFields = new Set(['min', 'max']);

function readFields() {
  for (const [key, selector] of Object.entries(fields)) {
    const field = query(selector);
    filters[key] = field.type === 'checkbox' ? field.checked : field.value.trim();
    if (priceFields.has(key)) filters[key] = field.value === '' ? null : Number(field.value);
  }
}

function writeFields() {
  for (const [key, selector] of Object.entries(fields)) {
    const field = query(selector);
    field[field.type === 'checkbox' ? 'checked' : 'value'] = filters[key] ?? '';
  }
}

function renderChips() {
  const chips = [];
  if (filters.query) chips.push(['query', `Búsqueda: ${filters.query}`]);
  if (filters.category !== 'Todos') chips.push(['category', filters.category]);
  if (filters.min !== null || filters.max !== null) {
    chips.push(['price', `${money(filters.min ?? 0)} — ${filters.max === null ? 'sin límite' : money(filters.max)}`]);
  }
  if (filters.offers) chips.push(['offers', 'Precio especial']);
  if (filters.rating) chips.push(['rating', 'Valoración ≥ 4.8']);
  if (filters.wireless) chips.push(['wireless', 'Inalámbrico']);

  query('#active-filters').innerHTML = chips.map(([key, label]) => `
    <button type="button" class="filter-chip" data-clear-filter="${key}" aria-label="Quitar filtro ${escapeHTML(label)}">
      ${escapeHTML(label)} <span aria-hidden="true">×</span>
    </button>
  `).join('');
}

export function renderCatalog() {
  const valid = validRange(filters);
  const matches = filterProducts(products, filters);
  query('#price-error').hidden = valid;
  ['#price-min', '#price-max'].forEach((selector) => {
    query(selector).setAttribute('aria-invalid', String(!valid));
  });
  query('#result-count').textContent = valid
    ? `${matches.length} de ${products.length} productos`
    : 'Revisa el rango de precio';

  query('#shop-grid').innerHTML = matches.length
    ? matches.map(renderProductCard).join('')
    : `
      <div class="empty">
        <h3>${valid ? 'Ninguna pieza coincide.' : 'El rango necesita un ajuste.'}</h3>
        <p>${valid
          ? 'Prueba ampliar el precio o quitar alguno de los filtros.'
          : 'El precio mínimo debe ser menor o igual al máximo.'}</p>
        <button type="button" class="button secondary" data-reset-filters>Restablecer filtros</button>
      </div>
    `;
  renderChips();
  onRender();
}

export function resetFilters(overrides = {}) {
  filters = { ...defaultFilters, ...overrides };
  writeFields();
  renderCatalog();
}

export function clearFilter(key) {
  if (key === 'price') {
    filters.min = null;
    filters.max = null;
  } else if (Object.hasOwn(defaultFilters, key)) {
    filters[key] = defaultFilters[key];
  }
  writeFields();
  renderCatalog();
  const target = query('#active-filters button') || query('#reset-filters');
  target.focus({ preventScroll: true });
}

export function initCatalog(refreshState) {
  onRender = refreshState;
  for (const [key, selector] of Object.entries(fields)) {
    const event = key === 'query' || priceFields.has(key) ? 'input' : 'change';
    query(selector).addEventListener(event, () => {
      readFields();
      renderCatalog();
    });
  }
  query('#reset-filters').addEventListener('click', () => resetFilters());
}
