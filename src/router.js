const ROUTES = new Set(['home', 'programme', 'venues', 'venue', 'artist', 'tickets', 'transport', 'about']);

export function parseRoute(hash = '') {
  const source = hash.replace(/^#/, '') || 'home';
  const [path, queryString = ''] = source.split('?');
  const [candidate, encodedId = ''] = path.split('/');
  const name = ROUTES.has(candidate) ? candidate : 'not-found';
  const id = ['venue', 'artist'].includes(name) && encodedId ? decodeURIComponent(encodedId) : null;
  const query = Object.fromEntries(new URLSearchParams(queryString));
  return { name, id, query };
}

export function routeHref(name, id = null, query = {}) {
  const path = id ? `${name}/${encodeURIComponent(id)}` : name;
  const params = new URLSearchParams(Object.entries(query).filter(([, value]) => value !== '' && value != null));
  return `#${path}${params.size ? `?${params}` : ''}`;
}
