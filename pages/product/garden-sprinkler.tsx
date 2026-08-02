import ProductPageLayout from '../../components/product/ProductPageLayout';
import { getProduct } from '../../lib/products';

export default function GardenSprinklerPage() {
  return (
    <div className="theme-green">
      <style jsx global>{`
        /* Main CTA buttons - override checkout-cta and primary buttons */
        .theme-green .checkout-cta,
        .theme-green .btn-primary,
        .theme-green .btn-gold,
        .theme-green .btn-accent {
          background: linear-gradient(135deg, #2D8B57 0%, #247146 100%);
          color: white;
          box-shadow: 0 12px 30px -4px rgba(45, 139, 87, 0.30), 0 4px 12px -2px rgba(45, 139, 87, 0.18);
        }
        
        .theme-green .checkout-cta:hover,
        .theme-green .btn-primary:hover,
        .theme-green .btn-gold:hover,
        .theme-green .btn-accent:hover {
          background: linear-gradient(135deg, #247146 0%, #1C5937 100%);
          box-shadow: 0 16px 40px -6px rgba(45, 139, 87, 0.5);
        }
        
        /* Form header and brand sections */
        .theme-green .bg-brand {
          background-color: #2D8B57 !important;
        }
        
        .theme-green .bg-brand-dark {
          background-color: #247146 !important;
        }
        
        .theme-green .text-brand {
          color: #2D8B57 !important;
        }
        
        .theme-green .border-brand,
        .theme-green .border-brand\/15 {
          border-color: rgba(45, 139, 87, 0.15) !important;
        }
        
        .theme-green .shadow-brand {
          box-shadow: 0 12px 30px -4px rgba(45, 139, 87, 0.30), 0 4px 12px -2px rgba(45, 139, 87, 0.18) !important;
        }
        
        /* Eyebrow/badge styling */
        .theme-green .eyebrow,
        .theme-green .eyebrow-light {
          color: #1C5937;
          background: rgba(45, 139, 87, 0.12);
          border-color: rgba(45, 139, 87, 0.25);
        }
        
        /* Star ratings */
        .theme-green .star-row,
        .theme-green .star-row svg {
          color: #2D8B57 !important;
          fill: #2D8B57;
        }
        
        /* All accent color replacements */
        .theme-green .text-accent,
        .theme-green .text-accent-dark,
        .theme-green .text-gold-600 {
          color: #2D8B57 !important;
        }
        
        .theme-green .bg-accent,
        .theme-green .bg-accent\/5,
        .theme-green .bg-gold-100 {
          background-color: rgba(45, 139, 87, 0.12) !important;
        }
        
        .theme-green .border-accent,
        .theme-green .border-accent\/25 {
          border-color: rgba(45, 139, 87, 0.25) !important;
        }
        
        .theme-green .ring-accent {
          --tw-ring-color: rgb(45 139 87) !important;
        }
        
        /* Gradient overrides */
        .theme-green .from-accent {
          --tw-gradient-from: #2D8B57 !important;
        }
        
        .theme-green .to-accent,
        .theme-green .to-accent-dark {
          --tw-gradient-to: #247146 !important;
        }
        
        /* Shadow overrides */
        .theme-green .shadow-gold {
          box-shadow: 0 12px 30px -4px rgba(45, 139, 87, 0.30), 0 4px 12px -2px rgba(45, 139, 87, 0.18) !important;
        }
        
        /* Scarcity badge - green tinted */
        .theme-green .bg-red-50 {
          background-color: #E8F5ED !important;
        }
        
        .theme-green .text-red-600,
        .theme-green .text-red-700,
        .theme-green .text-red-500 {
          color: #2D8B57 !important;
        }
        
        .theme-green .border-red-200 {
          border-color: rgba(45, 139, 87, 0.2) !important;
        }
        
        /* Selection color */
        .theme-green ::selection {
          background: rgba(45, 139, 87, 0.28);
        }

        /* ===== EXCLUDE SECTIONS - Keep Default Brand Colors ===== */
        
        /* Exclude upsell popup from green theme */
        .fixed.z-\\[90\\] .btn-gold,
        .fixed.z-\\[90\\] .checkout-cta {
          background: linear-gradient(135deg, #C49F5C 0%, #A47F3C 100%) !important;
          box-shadow: 0 12px 30px -4px rgba(196, 159, 92, 0.30), 0 4px 12px -2px rgba(196, 159, 92, 0.18) !important;
        }
        
        .fixed.z-\\[90\\] .btn-gold:hover,
        .fixed.z-\\[90\\] .checkout-cta:hover {
          background: linear-gradient(135deg, #A47F3C 0%, #8B6A2D 100%) !important;
          box-shadow: 0 16px 40px -6px rgba(196, 159, 92, 0.5) !important;
        }
        
        .fixed.z-\\[90\\] .bg-brand {
          background-color: #13294B !important;
        }
        
        .fixed.z-\\[90\\] .text-brand {
          color: #13294B !important;
        }
        
        .fixed.z-\\[90\\] .text-accent {
          color: #C49F5C !important;
        }
        
        .fixed.z-\\[90\\] .bg-accent,
        .fixed.z-\\[90\\] .bg-accent\\/10 {
          background-color: rgba(196, 159, 92, 0.1) !important;
        }
      `}</style>
      <ProductPageLayout product={getProduct('garden-sprinkler')} />
    </div>
  );
}
