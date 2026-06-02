/** Always call the API subdomain directly (required for static export on boyashop.store). */
const PRODUCTION_API = 'https://api.boyashop.store';

export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API).replace(/\/$/, '');
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
