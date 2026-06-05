import Link from 'next/link';
import { useState } from 'react';
import CartButton from './CartButton';
import StoreTrustRow from './StoreTrustRow';
import CollapsibleMenu from './ui/CollapsibleMenu';
import Icon from './ui/Icon';
import { STORE } from '../lib/products';
import { mainNavLinks } from '../lib/navigation';

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="site-header__logo" onClick={onClick}>
      <span className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand text-white shrink-0 shadow-brand">
        <Icon name="spark" size={20} className="text-accent" />
      </span>
      <span className="min-w-0 leading-none">
        <span className="block font-heading font-extrabold text-lg sm:text-xl text-brand tracking-tight">
          {STORE.nameEn}
        </span>
        <span className="block text-[0.7rem] sm:text-xs text-ink/55 mt-0.5 font-medium">
          {STORE.nameAr} · {STORE.tagline}
        </span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-header-shell">
      <header className="site-header">
        <div className="site-header__bar">
          <Logo onClick={closeMenu} />

          <nav className="site-header__nav hidden md:flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <a
              href={`https://wa.me/${STORE.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex icon-btn"
              aria-label="تواصل عبر واتساب"
            >
              <Icon name="whatsapp" size={22} />
            </a>
            <CartButton />
            <button
              type="button"
              className="md:hidden icon-btn"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="site-header__menu md:hidden bg-white px-4 py-2 max-h-[70vh] overflow-y-auto">
            <CollapsibleMenu title="التصفح" defaultOpen>
              <ul className="space-y-1">
                {mainNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between py-2.5 text-ink font-semibold hover:text-brand"
                      onClick={closeMenu}
                    >
                      {link.label}
                      <Icon name="arrow-left" size={16} className="text-ink/30" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleMenu>

            <a
              href={`https://wa.me/${STORE.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 mb-2 flex items-center justify-center gap-2 w-full py-3 rounded-full bg-brand/[0.06] text-brand font-bold"
              onClick={closeMenu}
            >
              <Icon name="whatsapp" size={18} /> تواصل معنا على واتساب
            </a>
          </nav>
        )}
      </header>
      <StoreTrustRow variant="light" />
    </div>
  );
}
