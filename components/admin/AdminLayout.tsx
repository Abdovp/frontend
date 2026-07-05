import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useAdminDocument } from './useAdminDocument';

type Props = {
  title: string;
  children: ReactNode;
};

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/profit', label: 'Profit' },
];

export default function AdminLayout({ title, children }: Props) {
  const router = useRouter();
  useAdminDocument();

  return (
    <>
      <Head>
        <title>{title} | Boya Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="admin-shell min-h-screen">
        <div className="admin-page mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <nav className="admin-tabs" aria-label="Admin navigation">
              {navItems.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-tab ${active ? 'admin-tab--active' : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-admin-muted sm:inline">Admin</span>
            </div>
          </div>

          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
