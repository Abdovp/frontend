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
          <span className="eyebrow mb-4 justify-center">
            <span className="w-6 h-px bg-current opacity-60" />
            كتالوج بويا شوب
          </span>
          <h2 className="font-heading text-3xl md:text-[2.6rem] font-extrabold text-ink leading-tight">
            متجر كامل لعالم السيارات — كيكبر معاك
          </h2>
          <p className="text-ink/60 mt-4 text-lg">
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
                    ? 'bg-white border-ink/[0.07] shadow-soft hover:shadow-card hover:-translate-y-1'
                    : 'bg-cream border-ink/[0.05]'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${
                    available ? 'bg-brand text-white shadow-brand' : 'bg-ink/[0.06] text-ink/40'
                  }`}
                >
                  <Icon name={c.icon} size={24} className={available ? 'text-accent' : ''} />
                </span>
                <h3 className="font-heading font-bold text-ink mb-1">{c.title}</h3>
                <p className="text-sm text-ink/55 mb-4">{c.desc}</p>
                <span
                  className={`badge-pill ${
                    available ? 'bg-brand/[0.07] text-brand' : 'bg-ink/[0.06] text-ink/45'
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
