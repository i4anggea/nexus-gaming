import { products } from '../data/catalog.js';
import { renderProductCard } from '../components/product-card.js';

export function selectFeaturedTab(button, refreshState) {
  document.querySelectorAll('[data-tab]').forEach((tab) => {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  const panel = document.querySelector('#featured-grid');
  panel.setAttribute('aria-labelledby', button.id);
  panel.innerHTML = products
    .filter((product) => product.tags.includes(button.dataset.tab))
    .slice(0, 4)
    .map(renderProductCard)
    .join('');
  refreshState();
}

export function initFeatured() {
  document.querySelector('.tabs').addEventListener('keydown', (event) => {
    const tabs = [...document.querySelectorAll('[data-tab]')];
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    const destinations = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    const target = tabs[destinations[event.key]];
    target.focus();
    target.click();
  });
}
