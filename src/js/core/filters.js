import { normalizeText } from './utils.js';

export const defaultFilters = {
  query: '',
  category: 'Todos',
  min: null,
  max: null,
  offers: false,
  rating: false,
  wireless: false,
  sort: 'default',
};

export function validRange({ min, max }) {
  return (
    (min === null || (Number.isFinite(min) && min >= 0)) &&
    (max === null || (Number.isFinite(max) && max >= 0)) &&
    (min === null || max === null || min <= max)
  );
}

export function filterProducts(products, filters) {
  if (!validRange(filters)) return [];
  const query = normalizeText(filters.query);

  const matches = products.filter((product) => {
    const searchableText = normalizeText([
      product.name,
      product.brand,
      product.category,
      ...Object.values(product.specs),
    ].join(' '));

    return (
      (filters.category === 'Todos' || product.category === filters.category) &&
      (!filters.offers || Boolean(product.old)) &&
      (!filters.rating || product.rating >= 4.8) &&
      (!filters.wireless || /2\.4|Bluetooth/i.test(product.specs.Conexión || '')) &&
      (filters.min === null || product.price >= filters.min) &&
      (filters.max === null || product.price <= filters.max) &&
      searchableText.includes(query)
    );
  });

  const sorters = {
    'price-up': (a, b) => a.price - b.price,
    'price-down': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || a.price - b.price,
    name: (a, b) => a.name.localeCompare(b.name, 'es'),
  };
  if (sorters[filters.sort]) matches.sort(sorters[filters.sort]);
  return matches;
}
