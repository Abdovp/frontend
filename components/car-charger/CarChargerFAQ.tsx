import { useState } from 'react';
import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right"
      >
        <span className="font-bold text-white">{q}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-cyan-300 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        >
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-white/60">{a}</p>}
    </div>
  );
}

export default function CarChargerFAQ({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden bg-[#0a0d14] py-14 md:py-20">
      <div className="container-wide relative">
        <h2 dir="rtl" className="mb-10 text-center font-heading text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
          الأسئلة الشائعة
        </h2>

        <div dir="rtl" className="mx-auto max-w-3xl space-y-8">
          {product.faqs.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 font-heading text-lg font-extrabold text-orange-300">{group.title}</h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <FaqRow key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
