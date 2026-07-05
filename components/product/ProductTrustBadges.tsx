import TrustBadgesStrip from '../TrustBadgesStrip';
import type { Product } from '../../lib/products';

interface ProductTrustBadgesProps {
  badges: Product['trustBadges'];
}

type Props = ProductTrustBadgesProps & {
  variant?: 'section' | 'embedded';
  className?: string;
};

export default function ProductTrustBadges({ badges, variant = 'section', className }: Props) {
  return <TrustBadgesStrip items={badges} variant={variant} className={className} />;
}
