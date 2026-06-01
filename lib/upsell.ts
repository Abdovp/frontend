import { productList, type Product, type ProductId } from './products';

export const UPSELL_PRICE = 99;
export const UPSELL_DURATION_SEC = 15;
export const UPSELL_INDEX_KEY = 'boya_upsell_index';

export function getUpsellCandidates(orderedIds: ProductId[]): Product[] {
  return productList.filter((p) => !orderedIds.includes(p.id));
}

export function hasUpsellAvailable(orderedIds: ProductId[]): boolean {
  return getUpsellCandidates(orderedIds).length > 0;
}

export function pickUpsellProduct(orderedIds: ProductId[]): Product | null {
  const pool = getUpsellCandidates(orderedIds);
  if (pool.length === 0) return null;

  if (typeof window === 'undefined') return pool[0];

  const index = Number(sessionStorage.getItem(UPSELL_INDEX_KEY) ?? '0');
  sessionStorage.setItem(UPSELL_INDEX_KEY, String(index + 1));

  return pool[index % pool.length];
}
