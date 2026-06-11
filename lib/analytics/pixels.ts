declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    ttq?: {
      load: (pixelId: string) => void;
      page: (params?: Record<string, unknown>, options?: Record<string, unknown>) => void;
      track: (event: string, params?: Record<string, unknown>, options?: Record<string, unknown>) => void;
      ready?: (callback: () => void) => void;
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

function readCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  return document.cookie.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    acc[key] = rest.join('=');
    return acc;
  }, {});
}

export function getFacebookCookies(): { fbp?: string; fbc?: string } {
  const cookies = readCookies();
  return { fbp: cookies._fbp, fbc: cookies._fbc };
}

export function getTikTokCookies(): { ttp?: string; ttclid?: string } {
  const cookies = readCookies();
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  return {
    ttp: cookies._ttp,
    ttclid: cookies.ttclid || params.get('ttclid') || undefined,
  };
}

export function pixelsAreReady(): boolean {
  if (typeof window === 'undefined') return false;
  const facebookReady = !PIXEL_IDS.facebook || typeof window.fbq === 'function';
  const tiktokReady = !PIXEL_IDS.tiktok || typeof window.ttq !== 'undefined';
  const snapchatReady = !PIXEL_IDS.snapchat || typeof window.snaptr === 'function';
  return facebookReady && tiktokReady && snapchatReady;
}
