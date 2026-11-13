import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/js/data/catalog.js';
import { defaultFilters, filterProducts, validRange } from '../src/js/core/filters.js';
import { escapeHTML } from '../src/js/core/utils.js';
import { sanitizeSession, loadSession, getState, addProducts, changeQuantity, getCartSummary, completeDemoOrder } from '../src/js/core/store.js';

const filter = (overrides) => filterProducts(products, { ...defaultFilters, ...overrides });

test('La búsqueda ignora tildes y mayúsculas', () => {
  assert.deepEqual(filter({ query: 'PERIFERICOS' }), filter({ query: 'periféricos' }));
  assert.ok(filter({ query: 'PERIFERICOS' }).length > 0);
});
test('Los filtros de precio, categoría y conexión se combinan', () => {
  const results = filter({ category: 'Periféricos', max: 2200, rating: true, wireless: true });
  assert.ok(results.length > 0);
  assert.ok(results.every((item) => item.category === 'Periféricos' && item.price <= 2200 && item.rating >= 4.8));
});
test('Un rango invertido o negativo no produce productos', () => {
  assert.equal(validRange({ min: 2000, max: 1000 }), false);
  assert.equal(validRange({ min: -1, max: null }), false);
  assert.deepEqual(filter({ min: 2000, max: 1000 }), []);
  assert.deepEqual(filter({ max: 0 }), []);
});
test('Ordenar por precio no modifica el catálogo original', () => {
  const original = products.map((item) => item.id);
  const sorted = filter({ sort: 'price-up' });
  assert.ok(sorted.every((item, index) => index === 0 || sorted[index - 1].price <= item.price));
  assert.deepEqual(products.map((item) => item.id), original);
});
test('El estado guardado rechaza IDs desconocidos y datos malformados', () => {
  const clean = sanitizeSession({ cart: { 1: 1000, 2: -1, 999: 2 }, favorites: [1, 1, 999], orders: [{ id: '<img>', total: 1, count: 1 }] });
  assert.deepEqual(clean, { cart: { 1: 99 }, favorites: [1], orders: [] });
  assert.deepEqual(sanitizeSession(null), { cart: {}, favorites: [], orders: [] });
});
test('Un lote inválido no añade parcialmente productos al carrito', () => {
  loadSession();
  assert.throws(() => addProducts([1, 999]));
  assert.deepEqual(getState().cart, {});
});
test('Carrito, cantidades y pedido demo conservan los totales', () => {
  loadSession();
  assert.throws(() => completeDemoOrder());
  addProducts([1, 1, 2]);
  changeQuantity(1, -1);
  const expected = products.find((item) => item.id === 1).price + products.find((item) => item.id === 2).price;
  assert.deepEqual(getCartSummary(), { count: 2, total: expected });
  const order = completeDemoOrder();
  assert.equal(order.total, expected);
  assert.match(order.id, /^NX-DEMO-\d{4,}$/);
  assert.equal(getCartSummary().count, 0);
});
test('El texto interpolado escapa HTML y atributos', () => {
  assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
