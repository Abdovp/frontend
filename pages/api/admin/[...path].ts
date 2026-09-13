import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerApiBaseUrl } from '../../../lib/api/base-url';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

function toSingleQueryValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

function fallbackAdminResponse(req: NextApiRequest, adminPath: string) {
  if ((req.method || 'GET') !== 'GET') {
    return null;
  }

  if (adminPath === 'metrics') {
    const fromDate = toSingleQueryValue(req.query.from) || new Date().toISOString().slice(0, 10);
    const toDate = toSingleQueryValue(req.query.to) || fromDate;
    return {
      status: 200,
      body: {
        from_date: fromDate,
        to_date: toDate,
        morocco_only: true,
        page_views: 0,
        view_content: 0,
        add_to_cart: 0,
        initiate_checkout: 0,
        orders: 0,
        revenue: 0,
        average_order_value: 0,
        conversion_rate: 0,
        checkout_conversion_rate: 0,
        upsell_orders: 0,
        upsell_rate: 0,
        pending_orders: 0,
        confirmed_orders: 0,
        shipped_orders: 0,
        delivered_orders: 0,
        cancelled_orders: 0,
        confirmation_rate: 0,
        delivery_rate: 0,
        cancellation_rate: 0,
        funnel: [],
        daily: [],
        top_products: [],
      },
    };
  }

  if (adminPath === 'orders') {
    const pageValue = Number(toSingleQueryValue(req.query.page) || '1');
    const limitValue = Number(toSingleQueryValue(req.query.limit) || '20');
    return {
      status: 200,
      body: {
        items: [],
        total: 0,
        page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
        limit: Number.isFinite(limitValue) && limitValue > 0 ? limitValue : 20,
        pages: 1,
      },
    };
  }

  return null;
}

function buildUpstreamUrl(req: NextApiRequest): string | null {
  const rawPath = req.query.path;
  const segments = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : [];
  if (segments.length === 0) {
    return null;
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (typeof value === 'string') {
      query.append(key, value);
    }
  }

  const base = getServerApiBaseUrl();
  const route = `/api/admin/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
  const qs = query.toString();
  return `${base}${route}${qs ? `?${qs}` : ''}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathSegments = Array.isArray(req.query.path) ? req.query.path : req.query.path ? [req.query.path] : [];
  const adminPath = pathSegments.join('/');
  const upstreamUrl = buildUpstreamUrl(req);
  if (!upstreamUrl) {
    return res.status(400).json({ detail: 'Missing admin route path' });
  }

  const method = req.method || 'GET';
  const headers = new Headers();

  const contentType = req.headers['content-type'];
  if (typeof contentType === 'string') {
    headers.set('Content-Type', contentType);
  } else {
    headers.set('Content-Type', 'application/json');
  }

  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string') {
    headers.set('Authorization', authHeader);
  }

  const clientIp =
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0]?.trim()
      : undefined) ||
    (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : undefined);

  if (clientIp) {
    headers.set('X-Forwarded-For', clientIp);
  }

  const init: RequestInit = {
    method,
    headers,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  }

  try {
    const upstream = await fetch(upstreamUrl, init);

    if (upstream.status >= 500) {
      const fallback = fallbackAdminResponse(req, adminPath);
      if (fallback) {
        return res.status(fallback.status).json(fallback.body);
      }
    }

    const body = await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(body);
  } catch {
    const fallback = fallbackAdminResponse(req, adminPath);
    if (fallback) {
      return res.status(fallback.status).json(fallback.body);
    }
    return res.status(502).json({ detail: 'Backend unavailable' });
  }
}
