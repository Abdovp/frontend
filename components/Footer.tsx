import Link from 'next/link';
import Icon from './ui/Icon';
import { CollapsibleMenuDark } from './ui/CollapsibleMenu';
import { STORE, STORE_TRUST_BADGES } from '../lib/products';
import { policyLinks } from '../lib/navigation';
import TrustBadgesStrip from './TrustBadgesStrip';

export default function Footer({ showTrustCards = true }: { showTrustCards?: boolean }) {
  return (
    <>
      {showTrustCards ? <TrustBadgesStrip items={STORE_TRUST_BADGES} /> : null}
      <footer className="bg-ink text-white">
      <div className="container-wide">
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
    </>
  );
}
