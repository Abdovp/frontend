import SectionHeading from '../ui/SectionHeading';
import Icon, { type IconName } from '../ui/Icon';
import { WARRANTY_DAYS } from '../../lib/products';

const badges: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'badge', title: 'متجر سيارات متخصص', desc: 'منتجات مختارة للسائق المغربي — ماشي متجر عام كيبيع أي شي.' },
  { icon: 'wallet', title: 'الدفع عند الاستلام', desc: 'تخلّص غير ملي تشوف الطرد ف يديك — بلا أي مخاطرة.' },
  { icon: 'refresh', title: `استرجاع ${WARRANTY_DAYS} يوم`, desc: 'ما عجبكش المنتج؟ كنرجعو ليك الفلوس بلا تعقيد.' },
  { icon: 'check-circle', title: 'تأكيد قبل التوصيل', desc: 'فريق مغربي كيتصل بيك للتأكيد قبل ما يخرج الطرد.' },
  { icon: 'shield', title: 'جودة مفحوصة', desc: 'كل شحنة كتعدّى من فحص جودة قبل ما توصلك.' },
  { icon: 'whatsapp', title: 'دعم بالدارجة 24/7', desc: 'جواب سريع على الواتساب — قبل وبعد الطلب.' },
];

export default function AuthoritySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="علاش بويا شوب"
            title="ثقة مبنية على المنطق، ماشي على الوعود"
            subtitle="كنبيعو بالعاطفة (المشكل ديالك)، وكنقنعو بالمنطق (الحل)، وكنثبتو بالأرقام (زبناء حقيقيين)."
            align="center"
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((b) => (
            <div key={b.title} className="card-elevated p-7">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand text-white shadow-brand mb-5">
                <Icon name={b.icon} size={24} className="text-accent" />
              </span>
              <h3 className="font-heading font-bold text-lg text-ink mb-2">{b.title}</h3>
              <p className="text-ink/60 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
