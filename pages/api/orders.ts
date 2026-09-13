import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerApiBaseUrl } from '../../lib/api/base-url';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

interface IncomingOrderItem {
  product_name?: unknown;
  sku?: unknown;
  quantity?: unknown;
}

interface IncomingOrderPayload {
  event_id?: unknown;
  total?: unknown;
  customer_name?: unknown;
  phone?: unknown;
  items?: unknown;
}

function buildFallbackOrder(body: unknown) {
  const payload = (body && typeof body === 'object' ? body : {}) as IncomingOrderPayload;

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

function asItems(value: unknown): IncomingOrderItem[] {
  return Array.isArray(value) ? (value as IncomingOrderItem[]) : [];
}

async function saveFallbackOrderToWebhook(orderBody: unknown, publicOrderId: string): Promise<boolean> {
  const webhookUrl = process.env.ORDER_FALLBACK_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return false;
  }

  const payload = (orderBody && typeof orderBody === 'object' ? orderBody : {}) as IncomingOrderPayload;
  const items = asItems(payload.items);

  const productSummary = items
    .map((item) => {
      const name = typeof item.product_name === 'string' ? item.product_name : 'منتج';
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
      return `${name} x${quantity}`;
    })
    .join(' | ');

  const skuSummary = items
    .map((item) => (typeof item.sku === 'string' ? item.sku : ''))
    .filter(Boolean)
    .join(', ');

  const totalQty = items.reduce(
    (sum, item) => sum + (typeof item.quantity === 'number' ? item.quantity : 1),
    0
  );

  const webhookPayload = {
    date: new Date().toISOString(),
    'order id': publicOrderId,
    nom: typeof payload.customer_name === 'string' ? payload.customer_name : '',
    telephone: typeof payload.phone === 'string' ? payload.phone : '',
    produit: productSummary,
    sku: skuSummary,
    'Qté': totalQty,
    'prix total': typeof payload.total === 'number' ? payload.total : 0,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });
    return response.ok;
  } catch {
    return false;
  }
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
      const fallbackOrder = buildFallbackOrder(req.body);
      const fallbackSaved = await saveFallbackOrderToWebhook(req.body, fallbackOrder.public_order_id);
      return res.status(200).json({
        ...fallbackOrder,
        status: fallbackSaved ? 'pending_backup' : 'pending_manual',
        tracked_via: fallbackSaved ? 'sheet_webhook' : 'fallback_local',
        warning: fallbackSaved
          ? undefined
          : 'Backend is down and fallback webhook is not configured/reachable. Save this order manually from confirmation details.',
      });
    }

    const body = await upstream.text();
    res
      .status(upstream.status)
      .setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(body);
  } catch {
    const fallbackOrder = buildFallbackOrder(req.body);
    const fallbackSaved = await saveFallbackOrderToWebhook(req.body, fallbackOrder.public_order_id);
    return res.status(200).json({
      ...fallbackOrder,
      status: fallbackSaved ? 'pending_backup' : 'pending_manual',
      tracked_via: fallbackSaved ? 'sheet_webhook' : 'fallback_local',
      warning: fallbackSaved
        ? undefined
        : 'Backend is down and fallback webhook is not configured/reachable. Save this order manually from confirmation details.',
    });
  }
}
