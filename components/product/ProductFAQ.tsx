import { useState } from 'react';
import Link from 'next/link';
import SectionHeading from '../ui/SectionHeading';
import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function ProductFAQ({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(0);

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
        <div className="space-y-3">
          {product.faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="card-flat overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
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
                    <p className="px-5 sm:px-6 pb-5 text-ink/75 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 relative overflow-hidden rounded-3xl bg-brand text-white p-8 md:p-10 text-center shadow-lift">
          <div className="absolute inset-0 hero-grid-bg opacity-60" />
          <div className="relative">
            <h3 className="font-heading text-2xl md:text-3xl font-extrabold mb-3">واجد تطلب؟</h3>
            <p className="text-white/75 mb-7 max-w-md mx-auto">
              فريق بويا شوب كيجاوب بالدارجة قبل وبعد الطلب — اطلب بكل ثقة.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gold"
              >
                رجع للعروض
                <Icon name="arrow-left" size={18} />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-bold py-4 px-7 rounded-full border border-white/25 text-white hover:bg-white/10 transition"
              >
                <Icon name="whatsapp" size={18} />
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
