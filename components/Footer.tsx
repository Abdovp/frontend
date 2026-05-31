import Link from 'next/link';
import Icon, { type IconName } from './ui/Icon';
import { CollapsibleMenuDark } from './ui/CollapsibleMenu';
import { WARRANTY_DAYS, STORE } from '../lib/products';
import { policyLinks } from '../lib/navigation';

const trustRow: { icon: IconName; text: string }[] = [
  { icon: 'wallet', text: 'دفع عند الاستلام' },
  { icon: 'truck', text: 'توصيل 24–48 ساعة' },
  { icon: 'refresh', text: `استرجاع ${WARRANTY_DAYS} يوم` },
  { icon: 'shield', text: 'جودة مضمونة' },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10 border-b border-white/10">
          {trustRow.map((t) => (
            <div key={t.text} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] text-accent shrink-0">
                <Icon name={t.icon} size={20} />
              </span>
              <span className="text-sm font-semibold text-white/85">{t.text}</span>
            </div>
          ))}
        </div>

        <div className="md:hidden py-2">
          <CollapsibleMenuDark title="المنتجات">
            <ul className="space-y-2.5 text-white/55 text-sm">
              <li><Link href="/product/pack" className="hover:text-accent transition">باك الحماية من السخونة</Link></li>
              <li><Link href="/product/magnetic-holder" className="hover:text-accent transition">حامل الهاتف المغناطيسي</Link></li>
              <li><Link href="/collections" className="hover:text-accent transition">كل المنتجات</Link></li>
            </ul>
          </CollapsibleMenuDark>

          <CollapsibleMenuDark title="المتجر">
            <ul className="space-y-2.5 text-white/55 text-sm">
              <li><Link href="/about" className="hover:text-accent transition">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition">اتصل بنا</Link></li>
            </ul>
          </CollapsibleMenuDark>

          <CollapsibleMenuDark title="السياسات">
            <ul className="space-y-2.5 text-white/55 text-sm">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </CollapsibleMenuDark>

          <CollapsibleMenuDark title="تواصل معنا">
            <ul className="space-y-2.5 text-white/55 text-sm">
              <li className="flex items-center gap-2"><Icon name="phone" size={15} className="text-accent" /> {STORE.phone}</li>
              <li className="flex items-center gap-2"><Icon name="mail" size={15} className="text-accent" /> {STORE.email}</li>
              <li>
                <a
                  href={`https://wa.me/${STORE.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent transition"
                >
                  <Icon name="whatsapp" size={15} className="text-accent" /> واتساب
                </a>
              </li>
            </ul>
          </CollapsibleMenuDark>
        </div>

        <div className="hidden md:grid md:grid-cols-5 gap-10 py-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-brand text-white">
                <Icon name="spark" size={20} className="text-accent" />
              </span>
              <span className="font-heading font-extrabold text-lg">{STORE.nameEn}</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              متجر مغربي متخصص ف إكسسوارات السيارات: حماية من الحر، راحة ف الطريق، وثقة ف الشراء.
            </p>
          </div>

          <div>
            <p className="font-heading font-bold mb-4">المنتجات</p>
            <ul className="space-y-2.5 text-white/55 text-sm">
              <li><Link href="/product/pack" className="hover:text-accent transition">باك الحماية من السخونة</Link></li>
              <li><Link href="/product/magnetic-holder" className="hover:text-accent transition">حامل الهاتف المغناطيسي</Link></li>
              <li><Link href="/collections" className="hover:text-accent transition">كل المنتجات</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-heading font-bold mb-4">المتجر</p>
            <ul className="space-y-2.5 text-white/55 text-sm">
              <li><Link href="/about" className="hover:text-accent transition">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition">اتصل بنا</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-heading font-bold mb-4">السياسات</p>
            <ul className="space-y-2.5 text-white/55 text-sm">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading font-bold mb-4">تواصل معنا</p>
            <ul className="space-y-2.5 text-white/55 text-sm">
              <li className="flex items-center gap-2"><Icon name="phone" size={15} className="text-accent" /> {STORE.phone}</li>
              <li className="flex items-center gap-2"><Icon name="mail" size={15} className="text-accent" /> {STORE.email}</li>
              <li>
                <a
                  href={`https://wa.me/${STORE.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent transition"
                >
                  <Icon name="whatsapp" size={15} className="text-accent" /> واتساب
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} {STORE.nameEn} — {STORE.nameAr}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
