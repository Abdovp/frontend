import type { IconName } from '../components/ui/Icon';
import { WARRANTY_DAYS } from './products';

export const STORE_TRUST_ITEMS: { icon: IconName; text: string }[] = [
  { icon: 'wallet', text: 'دفع عند الاستلام' },
  { icon: 'truck', text: 'توصيل 24–48 ساعة' },
  { icon: 'refresh', text: `استرجاع ${WARRANTY_DAYS} يوم` },
  { icon: 'shield', text: 'جودة مضمونة' },
];
