import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerApiBaseUrl } from '../../lib/api/base-url';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

function buildFallbackOrder(body: unknown) {
  const payload = (body && typeof body === 'object' ? body : {}) as {
    event_id?: unknown;
    total?: unknown;
  };

  const now = Date.now();
  const total = typeof payload.total === 'number' ? payload.total : 0;
  const suffix = String(now).slice(-6).padStart(6, '0');

  return {
    id: now,
    public_order_id: `boya${suffix}`,
    event_id: typeof payload.event_id === 'string' ? payload.event_id : '',
    status: 'pending',
    total,
    capi_sent: [],
    fallback: true,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  try {
    const clientIp =
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0]?.trim()
        : undefined) ||
      (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : undefined);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (clientIp) {
      headers['X-Forwarded-For'] = clientIp;
    }

    const upstream = await fetch(`${getServerApiBaseUrl()}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    if (upstream.status >= 500) {
      return res.status(200).json(buildFallbackOrder(req.body));
    }

    const body = await upstream.text();
    res
      .status(upstream.status)
      .setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(body);
  } catch {
    return res.status(200).json(buildFallbackOrder(req.body));
  }
}
