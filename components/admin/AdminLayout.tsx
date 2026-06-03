import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { clearAdminSession, getAdminUsername, isAdminLoggedIn } from '../../lib/admin/auth';
import AdminIcon from './AdminIcon';
import { useAdminDocument } from './useAdminDocument';

type Props = {
  title: string;
  children: ReactNode;
};

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' as const },
  { href: '/admin/orders', label: 'Orders', icon: 'orders' as const },
];

export default function AdminLayout({ title, children }: Props) {
  const router = useRouter();
  const username = getAdminUsername();
  useAdminDocument();

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
      <div className="admin-shell flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800/50 bg-slate-900 lg:flex">
          <div className="border-b border-white/10 px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-slate-900">
                <span className="text-sm font-extrabold">B</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Boya Shop</p>
                <p className="text-xs text-slate-400">Admin Console</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-link ${active ? 'admin-sidebar-link--active' : ''}`}
                >
                  <AdminIcon name={item.icon} className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{username}</p>
            <button type="button" onClick={logout} className="admin-sidebar-link mt-3 w-full">
              <AdminIcon name="logout" className="h-5 w-5 shrink-0" />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">COD Operations</p>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
              </div>
              <div className="flex gap-2 lg:hidden">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                      router.pathname === item.href
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </>
  );
}
