import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { adminLogin } from '../../lib/admin/api';
import { setAdminSession } from '../../lib/admin/auth';
import { useAdminDocument } from '../../components/admin/useAdminDocument';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useAdminDocument();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await adminLogin(username.trim(), password);
      setAdminSession(session.token, session.username);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login | Boya Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="admin-shell flex min-h-screen">
        <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-slate-900">
              <span className="text-lg font-extrabold">B</span>
            </div>
            <h1 className="mt-8 text-3xl font-bold tracking-tight">Boya Shop Admin</h1>
            <p className="mt-3 max-w-md text-slate-400">
              Manage COD orders, track Morocco traffic metrics, and update fulfillment status from one place.
            </p>
          </div>
          <p className="text-sm text-slate-500">Secure access for store operators only</p>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <span className="text-sm font-extrabold">B</span>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-900">Sign in</h1>
            </div>

            <div className="admin-card p-8">
              <h2 className="hidden text-xl font-bold text-slate-900 lg:block">Sign in</h2>
              <p className="mt-1 hidden text-sm text-slate-500 lg:block">Enter your admin credentials</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="username" className="admin-label">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="admin-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="admin-input"
                    required
                  />
                </div>
                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
                <button type="submit" disabled={loading} className="admin-btn-primary w-full disabled:opacity-60">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
