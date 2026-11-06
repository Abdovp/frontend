import { isProductAvailable, productList, products, type Product, type ProductId } from './products';

export const UPSELL_PRICE = 99;
export const UPSELL_DURATION_SEC = 15;
export const UPSELL_INDEX_KEY = 'boya_upsell_index';

const armrestUpsellProduct: Product = {
  ...products['car-charger'],
  id: 'car-armrest',
  sku: 'BOYA-47-DRIVER',
  slug: '47-piece-electric-screwdriver-set',
  href: '#',
  nameAr: 'مجموعة مفك كهربائي 47 قطعة',
  nameEn: '47-Piece Electric Screwdriver Set',
  category: 'أدوات منزلية',
  icon: 'settings',
  tagline: 'مجموعة عملية من 47 قطعة مع مفك كهربائي مناسب للمنزل والعمل والسيارة.',
  metaDescription:
    'مجموعة مفك كهربائي 47 قطعة من بويا شوب: أداء عملي وسريع، 47 قطعة متنوعة، وتوصيل سريع مع عرض خاص بعد الطلب.',
  unit: 'مجموعة',
  soldText: 'عرض خاص بعد الطلب',
  scarcityText: 'عرض محدود بعد الطلب',
  stockLeft: 99,
  deliveryDays: '24–48 ساعة',
  checkoutHeadline: 'مجموعة مفك كهربائي 47 قطعة',
  checkoutDescription: 'مفك كهربائي عملي مع 47 قطعة متنوعة وملحقات جاهزة للاستخدام اليومي.',
  highlights: ['47 قطعة متنوعة', 'مناسب للمنزل والعمل والسيارة', 'حمل سريع وسهولة في الاستخدام'],
  valueProps: [
    { icon: 'settings', title: 'تنوع', text: '47 قطعة تناسب أعمال التثبيت والتفكيك السريع' },
    { icon: 'zap', title: 'كفاءة', text: 'مفك كهربائي عملي ومريح للاستخدام اليومي' },
    { icon: 'truck', title: 'توصيل سريع', text: 'توصيل سريع من بويا شوب' },
  ],
  trustBadges: [
    { icon: 'badge', title: 'جودة عالية', subtitle: 'ملحقات متينة' },
    { icon: 'shield', title: '30 يوم', subtitle: 'ضمان كامل' },
    { icon: 'star', title: '4.9/5', subtitle: 'تقييم ممتاز' },
    { icon: 'truck', title: '24–48 ساعة', subtitle: 'توصيل سريع' },
  ],
  guarantees: products['car-charger'].guarantees,
  offers: [
    {
      quantity: 1,
      price: 99,
      label: 'مجموعة مفك كهربائي 47 قطعة',
      sublabel: 'عرض خاص بعد الطلب',
      perks: ['47 قطعة متنوعة', 'مفك كهربائي عملي', 'توصيل سريع', 'ضمان 30 يوم'],
    },
  ],
  galleryLabels: ['المجموعة', 'الملحقات', 'المفك الكهربائي'],
  galleryImages: ['/images/47-piece-electric-screwdriver-kit.jpg'],
  image: '/images/47-piece-electric-screwdriver-kit.jpg',
};

export function getUpsellCandidates(orderedIds: ProductId[]): Product[] {
  return productList.filter((p) => isProductAvailable(p) && !orderedIds.includes(p.id));
}

export function hasUpsellAvailable(orderedIds: ProductId[]): boolean {
  return getUpsellCandidates(orderedIds).length > 0;
}

export function pickUpsellProduct(orderedIds: ProductId[]): Product | null {
  const lastOrderedId = orderedIds.at(-1);

  if (lastOrderedId === 'car-armrest') {
    return armrestUpsellProduct;
  }

  const preferredPackId = lastOrderedId === 'garden-sprinkler' || lastOrderedId === 'car-vacuum' ? 'face-pack' : null;

  if (preferredPackId) {
    const preferred = productList.find((p) => p.id === preferredPackId);
    if (preferred && !orderedIds.includes(preferred.id) && isProductAvailable(preferred)) {
      return preferred;
    }
  }

  const charger = productList.find((p) => p.id === 'car-charger');
  if (charger && !orderedIds.includes('car-charger') && isProductAvailable(charger)) {
    return charger;
  }

  const pool = getUpsellCandidates(orderedIds);
  if (pool.length === 0) return null;

  if (typeof window === 'undefined') return pool[0];

  const index = Number(sessionStorage.getItem(UPSELL_INDEX_KEY) ?? '0');
  sessionStorage.setItem(UPSELL_INDEX_KEY, String(index + 1));

  return pool[index % pool.length];
}
