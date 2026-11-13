import { icons } from '../data/icons.js';

export function renderIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || icons.bag}</svg>`;
}

export function mountIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((element) => {
    if (!element.querySelector('svg')) {
      element.insertAdjacentHTML('afterbegin', renderIcon(element.dataset.icon));
    }
  });
}
