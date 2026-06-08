import { useMemo, useState } from 'react';
import Link from 'next/link';
import SectionHeading from '../ui/SectionHeading';
import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

function defaultOpenKey(faqs: Product['faqs']): string | null {
  const shippingGroup = faqs[1];
  if (!shippingGroup) return null;
  const returnIdx = shippingGroup.items.findIndex((faq) => faq.q.includes('ما عجبنيش'));
  return returnIdx >= 0 ? `1-${returnIdx}` : null;
}

export default function ProductFAQ({ product }: { product: Product }) {
  const initialOpen = useMemo(() => defaultOpenKey(product.faqs), [product.faqs]);
  const [open, setOpen] = useState<string | null>(initialOpen);

  return (
    <section className="section-padding bg-cream pb-24 md:pb-28">
      <div className="container-wide max-w-3xl">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="أسئلة شائعة"
            title="جاوبنا على الشكوك قبل ما تطلب"
            align="center"
          />
        </div>
        <div className="space-y-8">
          {product.faqs.map((group, groupIndex) => (
            <div key={group.title}>
              <p className="text-sm font-bold text-brand mb-3">{group.title}</p>
              <div className="space-y-3">
                {group.items.map((faq, itemIndex) => {
                  const key = `${groupIndex}-${itemIndex}`;
                  const isOpen = open === key;
                  return (
                    <div key={faq.q} className="card-flat overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-start gap-4"
                        aria-expanded={isOpen}
                      >
                        <span className="font-heading font-bold text-ink">{faq.q}</span>
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded-full bg-brand/[0.07] text-brand shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          <Icon name="chevron-down" size={16} />
                        </span>
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 sm:px-6 pb-5 text-ink leading-relaxed font-medium">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 relative overflow-hidden rounded-3xl bg-ink text-white p-8 md:p-10 text-center shadow-lift">
          <div className="absolute inset-0 hero-grid-bg opacity-60" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent mb-4">
              <Icon name="shield" size={14} />
              اطلب بثقة
            </p>
            <h3 className="font-heading text-2xl md:text-3xl font-extrabold mb-3">ما زلت عندك شك؟</h3>
            <p className="text-white/65 mb-3 max-w-md mx-auto">
              فريق بويا شوب كيجاوب بالدارجة قبل وبعد الطلب — اطلب بكل ثقة والدفع عند الاستلام.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50 mb-7">
              <span className="flex items-center gap-1.5">
                <Icon name="wallet" size={14} className="text-accent" />
                دفع عند الاستلام
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="refresh" size={14} className="text-accent" />
                ضمان 30 يوم
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="truck" size={14} className="text-accent" />
                توصيل 24–48 ساعة
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gold"
              >
                <Icon name="cart" size={18} />
                اطلب دابا
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-bold py-4 px-7 rounded-full border border-white/25 text-white hover:bg-white/10 transition"
              >
                <Icon name="whatsapp" size={18} />
                تواصل معنا ف الواتساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
