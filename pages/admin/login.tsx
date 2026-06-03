import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { adminLogin } from '../../lib/admin/api';
import { setAdminSession } from '../../lib/admin/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await adminLogin(username.trim(), password);
      setAdminSession(session.token, session.username);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>تسجيل الدخول | Boya Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark via-brand to-brand-light px-4" dir="rtl">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lift">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest2 text-accent-dark">Boya Shop</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-ink">لوحة الإدارة</h1>
            <p className="mt-2 text-sm text-slate-500">COD Dashboard — الطلبات والإحصائيات</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-ink">
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                required
              />
            </div>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-brand transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
