import Link from 'next/link';
import Icon, { type IconName } from '../ui/Icon';

const categories: { icon: IconName; title: string; desc: string; status: string; href: string | null }[] = [
  { icon: 'fan', title: 'تبريد وحماية', desc: 'حلول ضد الحرارة والشمس', status: 'متوفر', href: '/collections' },
  { icon: 'pin', title: 'راحة السياقة', desc: 'تنظيم وثبات داخل السيارة', status: 'متوفر', href: '/collections' },
  { icon: 'leaf', title: 'عناية وتنظيف', desc: 'منتجات العناية بالطوموبيل', status: 'قريباً', href: null },
  { icon: 'spark', title: 'إكسسوارات عملية', desc: 'إضافات للاستعمال اليومي', status: 'قريباً', href: null },
];

export default function HomeCatalogSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-5 justify-center">
            كتالوج بويا شوب
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-ink leading-[1.12]">
            متجر كامل لعالم السيارات — كيكبر معاك
          </h2>
          <p className="text-ink/75 mt-4 text-lg">
            ماشي محدود بمنتج ولا جوج. كنبنيو كتالوج مختار بعناية، من الحماية والتبريد حتى الراحة ف الطريق.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => {
            const available = Boolean(c.href);
            const inner = (
              <div
                className={`group h-full rounded-2xl border p-6 transition-all duration-300 ${
                  available
                    ? 'bg-white border-brand/[0.1] shadow-card hover:shadow-lift hover:-translate-y-1.5'
                    : 'bg-cream border-ink/[0.05]'
                }`}
              >
                <div className="relative mb-5 inline-flex">
                  <span
                    className={`flex items-center justify-center w-14 h-14 rounded-2xl ${
                      available ? 'bg-brand text-white shadow-brand' : 'bg-ink/[0.06] text-ink/40'
                    }`}
                  >
                    <Icon name={c.icon} size={26} className={available ? 'text-accent' : ''} />
                  </span>
                  {available && (
                    <span className="absolute -top-1.5 -end-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white shadow-gold" />
                  )}
                </div>
                <h3 className={`font-heading font-bold text-lg mb-1 ${available ? 'text-ink' : 'text-ink/60'}`}>{c.title}</h3>
                <p className="text-sm text-ink/60 mb-4">{c.desc}</p>
                <span
                  className={`badge-pill ${
                    available ? 'bg-brand text-white shadow-brand' : 'bg-ink/[0.06] text-ink/45'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            );
            return c.href ? (
              <Link key={c.title} href={c.href}>
                {inner}
              </Link>
            ) : (
              <div key={c.title}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
