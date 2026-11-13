import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { products, categories } from '../src/js/data/catalog.js';
import { escapeHTML } from '../src/js/core/utils.js';
import { renderProductCard } from '../src/js/components/product-card.js';
import { renderCategoryList } from '../src/js/components/category-list.js';
import { formatHTML } from './format-html.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');

// El orden define explícitamente la composición de la página.
const components = {
  header: 'layout/header',
  hero: 'sections/hero',
  categories: 'sections/categories',
  featured: 'sections/featured',
  setup: 'sections/setup',
  comparison: 'sections/comparison',
  promotion: 'sections/promotion',
  benefits: 'sections/benefits',
  newsletter: 'sections/newsletter',
  catalog: 'views/catalog',
  footer: 'layout/footer',
  modal: 'layout/modal',
};

const data = {
  categories: renderCategoryList(categories),
  featuredProducts: products.slice(0, 4).map(renderProductCard).join(''),
  catalogProducts: products.map(renderProductCard).join(''),
  categoryOptions: categories.map(([name]) => {
    const count = products.filter((product) => product.category === name).length;
    return `<option value="${escapeHTML(name)}">${escapeHTML(name)} (${count})</option>`;
  }).join(''),
};

function resolveData(template) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] ?? match);
}

let html = await readFile(path.join(root, 'src/index.html'), 'utf8');
for (const [name, source] of Object.entries(components)) {
  const template = await readFile(path.join(root, `src/components/${source}.html`), 'utf8');
  html = html.replace(`{{${name}}}`, resolveData(template));
}
if (/\{\{\w+\}\}/.test(html)) throw new Error('La página contiene un componente sin resolver.');

const styles = [
  'tokens', 'base', 'navigation', 'hero', 'categories', 'products', 'setup',
  'comparison', 'promotion', 'benefits', 'newsletter', 'footer', 'catalog',
  'dialogs', 'login', 'responsive', 'accessibility',
];
const sheets = await Promise.all(styles.map(async (name) => {
  const css = await readFile(path.join(root, `src/styles/${name}.css`), 'utf8');
  return `/* ===== ${name.toUpperCase()} ===== */\n${css.replaceAll('../assets/', 'assets/')}`;
}));

// dist es una salida generada; las fuentes y los recursos viven en src y public.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'public'), output, { recursive: true });
await cp(path.join(root, 'src/js'), path.join(output, 'js'), { recursive: true });
await cp(path.join(root, 'src/app.js'), path.join(output, 'app.js'));
await writeFile(path.join(output, 'index.html'), formatHTML(html));
await writeFile(path.join(output, 'style.css'), `${sheets.join('\n')}\n`);
console.log('NEXUS: componentes ensamblados, estilos agrupados y módulos copiados a dist.');
