const homeTitle = 'NEX — Hardware fuera de serie.';
let previousView = null;

export function applyRoute({ focus = false } = {}) {
  const catalog = location.hash === '#tienda';
  document.querySelector('#home-view').hidden = catalog;
  document.querySelector('#tienda').hidden = !catalog;
  document.title = catalog ? 'Catálogo de hardware — NEXUS' : homeTitle;

  document.querySelectorAll('.nav nav a').forEach((link) => {
    const active = link.hash === location.hash;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  if (catalog && previousView !== 'catalog') {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focus) document.querySelector('#catalog-title').focus({ preventScroll: true });
  }
  previousView = catalog ? 'catalog' : 'home';
}

export function navigateToCatalog() {
  if (location.hash === '#tienda') applyRoute({ focus: true });
  else location.hash = 'tienda';
}

export function initRouter() {
  window.addEventListener('hashchange', () => applyRoute({ focus: true }));
  applyRoute();
}
