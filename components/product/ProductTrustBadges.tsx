import TrustBadgesStrip from '../TrustBadgesStrip';
import type { Product } from '../../lib/products';

interface ProductTrustBadgesProps {
  badges: Product['trustBadges'];
}

export default function ProductTrustBadges({ badges }: ProductTrustBadgesProps) {
  return <TrustBadgesStrip items={badges} />;
}
