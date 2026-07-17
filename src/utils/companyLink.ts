// Every top-level route folder under src/app. Kept in sync with the
// filesystem so /[company] (any other single-segment path) can stay public
// for anonymous prospects without listing it explicitly.
export const APP_ROUTES = new Set([
  'admin', 'alerts', 'api', 'configuration', 'dashboard', 'data-center',
  'expenses', 'insights', 'inventory', 'landing', 'locations', 'login',
  'machines', 'map', 'orders', 'pricing', 'products', 'profile',
  'promotions', 'purchases', 'routes', 'settings', 'signup', 'team',
  'trips', 'users',
])

export function isCompanyDemoLink(pathname: string) {
  const [, first, rest] = pathname.split('/')
  return Boolean(first) && !rest && !APP_ROUTES.has(first)
}

export function parseCompanyRoute(pathname: string): string | null {
  const [, first, ...rest] = pathname.split('/')
  if (!first || APP_ROUTES.has(first) || rest.length === 0) return null
  if (!APP_ROUTES.has(rest[0])) return null
  return `/${rest.join('/')}`
}
