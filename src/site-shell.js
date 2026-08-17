const navigation = [
  ['programme', 'Ajakava'],
  ['venues', 'Paigad'],
  ['tickets', 'Piletid'],
  ['transport', 'Transport'],
  ['about', 'Meist'],
];

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

  return `<header class="paper-header">${wordmark}${menu}<nav${navAttrs} aria-label="Primary">${navigation.map((item) => navLink(item, active)).join('')}</nav></header>`;
}

export function renderSiteShell({ active, content, tone = 'light' }) {
  return `<div class="utility-site utility-site--${tone}">
    ${renderPaperHeader({ active, homeLink: true })}
    <div id="utility-content" tabindex="-1">${content}</div>
    <footer class="utility-footer"><a href="#home" aria-label="HELI avaleht"><img src="/assets/helihorizontal.svg" alt=""></a><p>Lorem ipsum dolor sit amet</p><div><a href="#about?section=contact">Lorem</a><a href="#about?section=faq">Ipsum</a></div></footer>
  </div>`;
}
