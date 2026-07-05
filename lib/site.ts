const DEFAULT_SITE_URL = 'https://boyashop.store';
const DEFAULT_DOMAIN = 'boyashop.store';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || DEFAULT_DOMAIN;

export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
