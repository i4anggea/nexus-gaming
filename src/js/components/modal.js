import { mountIcons } from './icon.js';

const focusAttributes = ['data-compare-select', 'data-qty', 'data-favorite'];
let trigger = null;

export function openModal(label, html, { preserveFocus = false } = {}) {
  const dialog = document.querySelector('#modal');
  const active = document.activeElement;
  const focusKey = preserveFocus && focusAttributes.find((key) => active?.hasAttribute(key));
  const focusValue = focusKey ? active.getAttribute(focusKey) : null;
  const delta = active?.getAttribute('data-delta');

  if (!dialog.open) trigger = active;
  document.querySelector('#modal-label').textContent = label;
  document.querySelector('#modal-title').textContent = label;
  document.querySelector('#modal-content').innerHTML = html;
  mountIcons(dialog);
  if (!dialog.open) dialog.showModal();

  if (focusKey) {
    const selector = `[${focusKey}="${CSS.escape(focusValue)}"]${delta ? `[data-delta="${delta}"]` : ''}`;
    const target = dialog.querySelector(selector);
    (target || dialog.querySelector('#close-modal')).focus({ preventScroll: true });
  } else {
    dialog.querySelector('#close-modal').focus({ preventScroll: true });
  }
}

export function closeModal() {
  document.querySelector('#modal').close();
}

export function initModal() {
  const dialog = document.querySelector('#modal');
  document.querySelector('#close-modal').addEventListener('click', closeModal);
  dialog.addEventListener('close', () => {
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal();
  });
}
