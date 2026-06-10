declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    ttq?: {
      load: (pixelId: string) => void;
      page: (params?: Record<string, unknown>, options?: Record<string, unknown>) => void;
      track: (event: string, params?: Record<string, unknown>, options?: Record<string, unknown>) => void;
    };
    snaptr?: (...args: unknown[]) => void;
  }
}

export const PIXEL_IDS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
  snapchat: process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID || '',
};

export function hasAnyPixel(): boolean {
  return Boolean(PIXEL_IDS.facebook || PIXEL_IDS.tiktok || PIXEL_IDS.snapchat);
}

export function getFacebookCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    acc[key] = rest.join('=');
    return acc;
  }, {});
  return { fbp: cookies._fbp, fbc: cookies._fbc };
}
