export const utilityNavigation = [
  ['programme', 'Ajakava'],
  ['venues', 'Paigad'],
  ['tickets', 'Piletid'],
  ['transport', 'Transport'],
  ['about', 'Meist'],
];

const navigation = utilityNavigation;

export function utilityNavKey(routeName) {
  if (routeName === 'venue') return 'venues';
  if (routeName === 'artist') return 'programme';
  if (utilityNavigation.some(([id]) => id === routeName)) return routeName;
  return null;
}

export function utilitySwipeDirection(fromKey, toKey) {
  const order = utilityNavigation.map(([id]) => id);
  const from = order.indexOf(fromKey);
  const to = order.indexOf(toKey);
  if (from < 0 || to < 0 || from === to) return 0;
  return to > from ? 1 : -1;
}

function navLink([route, label, anchor], active) {
  const current = active === route ? ' aria-current="page"' : '';
  return `<a class="paper-nav-link" href="#${route}${anchor ? `?section=${anchor}` : ''}"${current}>${label}</a>`;
}

export function renderPaperHeader({ active = null, homeLink = false } = {}) {
  const wordmark = homeLink
    ? `<a class="paper-wordmark" href="#home" aria-label="HELI avaleht"><img src="/assets/helihorizontal.svg" alt=""></a>`
    : `<div class="paper-wordmark" role="img" aria-label="HELI"><img src="/assets/helihorizontal.svg" alt=""></div>`;
  const menu = homeLink
    ? `<button class="utility-menu-button" type="button" aria-expanded="false" aria-controls="utility-navigation"><span>Menüü</span></button>`
    : '';
  const navAttrs = homeLink ? ' id="utility-navigation" class="utility-navigation"' : '';

  return `<header class="paper-header">${wordmark}${menu}<nav${navAttrs} aria-label="Primary"><div class="utility-navigation-panel">${navigation.map((item) => navLink(item, active)).join('')}</div></nav></header>`;
}

export function syncUtilityHeader(root, active) {
  if (!root || !active) return;
  root.querySelectorAll('.paper-nav-link').forEach((link) => {
    const href = link.getAttribute?.('href');
    if (href === `#${active}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

export function renderSiteShell({ active, content, tone = 'light' }) {
  return `<div class="utility-site utility-site--${tone}">
    ${renderPaperHeader({ active, homeLink: true })}
    <div class="utility-swipe-body">
    <div id="utility-content" class="t-panel-slide" data-open="false" aria-busy="true" data-route="${active || 'page'}" tabindex="-1">${content}</div>
    <footer class="utility-footer"><a href="#home" aria-label="HELI avaleht"><img src="/assets/helihorizontal.svg" alt=""></a><p>Programmi detailid on näidisena, kuni koosseis on avalik.</p><div><a href="#about?section=contact">Kontakt</a><a href="#about?section=faq">KKK</a></div></footer>
    </div>
  </div>`;
}

export function revealRoutePanel(root, requestFrame = globalThis.requestAnimationFrame) {
  const panel = root?.querySelector?.('.t-panel-slide[data-open="false"]');
  if (!panel || typeof requestFrame !== 'function') return null;

  void panel.offsetWidth;
  return requestFrame(() => {
    panel.setAttribute('data-open', 'true');
    panel.setAttribute('aria-busy', 'false');
  });
}
