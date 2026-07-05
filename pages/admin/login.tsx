import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAdminDocument } from '../../components/admin/useAdminDocument';

export default function AdminLoginPage() {
  const router = useRouter();
  useAdminDocument();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <>
      <Head>
        <title>Login | Boya Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="admin-shell flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-admin-accent text-white">
              <span className="text-lg font-extrabold">B</span>
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Boya Shop Admin</h1>
            <p className="mt-2 text-sm text-admin-muted">
              Manage COD orders, track Morocco traffic metrics, and update fulfillment status.
            </p>
          </div>

          <div className="admin-panel">
            <h2 className="text-xl font-bold text-slate-900">Redirecting...</h2>
            <p className="mt-1 text-sm text-admin-muted">Admin login is disabled. Opening the dashboard.</p>
          </div>
        </div>
      </div>
    </>
  );
}
