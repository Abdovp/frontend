import type { GuaranteeItem } from '../../lib/products';
import Icon from '../ui/Icon';

interface ProductGuaranteeBarProps {
  items: GuaranteeItem[];
}

export default function ProductGuaranteeBar({ items }: ProductGuaranteeBarProps) {
  return (
    <div className="guarantee-bar">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 py-9 md:py-10">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="guarantee-icon">
                <Icon name={item.icon} size={22} />
              </span>
              <div className="leading-tight">
                <p className="font-bold text-sm md:text-base">{item.title}</p>
                <p className="text-white/60 text-xs md:text-sm mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
