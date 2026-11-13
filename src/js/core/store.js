import { products } from '../data/catalog.js';

const STORAGE_KEY = 'nexus-demo';
const productIds = new Set(products.map((product) => product.id));
const subscribers = new Set();

/** No confiamos en los datos recuperados del almacenamiento del navegador. */
export function sanitizeSession(value) {
  const source = value && typeof value === 'object' ? value : {};
  const cart = {};

  if (source.cart && typeof source.cart === 'object') {
    for (const [key, quantity] of Object.entries(source.cart)) {
      const id = Number(key);
      if (productIds.has(id) && Number.isInteger(quantity) && quantity > 0) {
        cart[id] = Math.min(quantity, 99);
      }
    }
  }

  const favorites = Array.isArray(source.favorites)
    ? [...new Set(source.favorites.filter((id) => productIds.has(id)))]
    : [];

  const orders = Array.isArray(source.orders)
    ? source.orders.filter((order) => (
      order && /^NX-DEMO-\d{4,}$/.test(order.id) &&
      Number.isFinite(order.total) && order.total >= 0 &&
      Number.isInteger(order.count) && order.count > 0
    )).map(({ id, total, count }) => ({ id, total, count }))
    : [];

  return { cart, favorites, orders };
}

let state = sanitizeSession({});

export function loadSession() {
  try {
    state = sanitizeSession(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
    state = sanitizeSession({});
  }
}

export function getState() {
  return structuredClone(state);
}

export function subscribe(listener) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

function save() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // El modo privado puede bloquear el almacenamiento. La sesión sigue en memoria.
  }
  subscribers.forEach((listener) => listener(getState()));
}

export function getProduct(id) {
  return products.find((product) => product.id === Number(id));
}

export function getCartSummary() {
  return products.reduce((summary, product) => {
    const quantity = state.cart[product.id] || 0;
    summary.count += quantity;
    summary.total += quantity * product.price;
    return summary;
  }, { count: 0, total: 0 });
}

export function addProducts(ids) {
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 20 ||
      ids.some((id) => !Number.isInteger(id) || !productIds.has(id))) {
    throw new Error('Se requieren identificadores de productos válidos.');
  }

  // Validamos el lote entero antes de modificar el carrito.
  ids.forEach((id) => {
    state.cart[id] = Math.min(99, (state.cart[id] || 0) + 1);
  });
  save();
  return getCartSummary();
}

export function changeQuantity(id, delta) {
  if (!productIds.has(id) || ![-1, 1].includes(delta)) return;
  const quantity = Math.min(99, Math.max(0, (state.cart[id] || 0) + delta));
  if (quantity > 0) state.cart[id] = quantity;
  else delete state.cart[id];
  save();
}

export function removeProduct(id) {
  delete state.cart[id];
  save();
}

export function toggleFavorite(id) {
  if (!productIds.has(id)) return false;
  const selected = !state.favorites.includes(id);
  state.favorites = selected
    ? [...state.favorites, id]
    : state.favorites.filter((favorite) => favorite !== id);
  save();
  return selected;
}

export function completeDemoOrder() {
  const summary = getCartSummary();
  if (!summary.count) throw new Error('El carrito está vacío.');
  const nextNumber = state.orders.reduce((max, order) => (
    Math.max(max, Number(order.id.replace('NX-DEMO-', '')))
  ), 0) + 1;
  const order = {
    id: `NX-DEMO-${String(nextNumber).padStart(4, '0')}`,
    total: summary.total,
    count: summary.count,
  };
  state.orders.push(order);
  state.cart = {};
  save();
  return order;
}
