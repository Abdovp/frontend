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
        <ul className="space-y-3 mb-8">
          {problems.map((p) => (
            <li key={p} className="flex items-center gap-3 text-ink/75">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-500 shrink-0">
                <Icon name="close" size={14} />
              </span>
              <span>{p}</span>
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
