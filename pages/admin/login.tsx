import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { useAdminDocument } from '../../components/admin/useAdminDocument';
import { isAdminLoggedIn, setAdminSession } from '../../lib/admin/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  useAdminDocument();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) {
      void router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(body?.detail || 'Could not sign in');
      }

      const body = (await response.json()) as { token: string; username: string };
      setAdminSession(body.token, body.username);
      void router.replace('/admin');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not sign in');
    } finally {
      setLoading(false);
    }
  };

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

          <form className="admin-panel space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="admin-username">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="admin-input"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="admin-input"
                autoComplete="current-password"
                required
              />
            </div>

            {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button type="submit" className="admin-btn-secondary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
