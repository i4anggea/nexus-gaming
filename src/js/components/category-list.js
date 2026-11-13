import { escapeHTML } from '../core/utils.js';

export function renderCategoryList(categories) {
  return categories.map(([name, description], index) => `
    <button type="button" class="category-card" data-category="${escapeHTML(name)}">
      <span class="category-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="category-info">
        <span class="category-name">${escapeHTML(name)}</span>
        <span class="category-description">${escapeHTML(description)}</span>
      </span>
      <span class="category-arrow" aria-hidden="true">↗</span>
    </button>
  `).join('');
}
