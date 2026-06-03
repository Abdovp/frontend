import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { clearAdminSession, getAdminUsername, isAdminLoggedIn } from '../../lib/admin/auth';

type Props = {
  title: string;
  children: ReactNode;
};

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: '📊' },
  { href: '/admin/orders', label: 'الطلبات', icon: '📦' },
];

export default function AdminLayout({ title, children }: Props) {
  const router = useRouter();
  const username = getAdminUsername();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace('/admin/login');
    }
  }, [router]);

  function logout() {
    clearAdminSession();
    router.replace('/admin/login');
  }

  if (!isAdminLoggedIn()) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{title} | Boya Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen bg-slate-50" dir="rtl">
        <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 border-l border-slate-200 bg-brand text-white lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <p className="text-xs uppercase tracking-widest2 text-accent">Boya Shop</p>
              <h1 className="mt-1 font-heading text-xl font-bold">لوحة الإدارة</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active ? 'bg-white/15 text-white shadow-brand' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/10 px-6 py-4">
              <p className="text-xs text-white/60">متصل باسم</p>
              <p className="mt-1 text-sm font-semibold">{username}</p>
              <button
                type="button"
                onClick={logout}
                className="mt-3 w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:mr-64">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest2 text-accent-dark">COD Dashboard</p>
                <h2 className="font-heading text-xl font-bold text-ink">{title}</h2>
              </div>
              <div className="flex items-center gap-2 lg:hidden">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                      router.pathname === item.href ? 'bg-brand text-white' : 'bg-slate-100 text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </>
  );
}
