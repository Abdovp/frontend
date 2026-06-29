import SectionHeading from '../ui/SectionHeading';
import Icon from '../ui/Icon';
import Link from 'next/link';

const problems = [
  'حرارة، رطوبة، وتلف داخلي كيخسّر طوموبيلك',
  'إكسسوارات رخيصة كتخسّرك الفلوس والوقت',
  'متاجر عامة ما عندها لا تخصص لا دعم حقيقي',
];

export default function PainPromiseSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide max-w-3xl" dir="rtl">
        <SectionHeading
          eyebrow="مشاكل حقيقية، حل واحد"
          title="كل سائق مغربي كيعاني من نفس المشاكل ف الطريق"
          subtitle="بويا شوب فهمات الحرارة، التعب، والقلق على السيارة. لهذا كنوفرو منتجات مختارة كتحل المشكل فعلاً — ماشي كلام فالهضرة."
          align="center"
        />
        <ul className="space-y-4 mb-10">
          {problems.map((p) => (
            <li key={p} className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-red-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white shrink-0 shadow-[0_4px_12px_rgba(220,38,38,0.3)]">
                <Icon name="close" size={14} />
              </span>
              <span className="font-semibold leading-snug">{p}</span>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <Link href="/collections" className="btn-primary">
            تصفّح الحلول
            <Icon name="arrow-left" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
