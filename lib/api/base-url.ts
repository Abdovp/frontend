/** Always call the API subdomain directly (required for static export on boyashop.store). */
const PRODUCTION_API = 'https://api.boyashop.store';

export function getApiBaseUrl(): string {
  // Local dev: same-origin /api/* so Next.js rewrites can proxy (see next.config.js).
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
  }

  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  return (fromEnv || PRODUCTION_API).replace(/\/$/, '');
}

export function apiUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`;
}

export function getServerApiBaseUrl(): string {
  return (
    process.env.API_PROXY_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    PRODUCTION_API
  ).replace(/\/$/, '');
}
