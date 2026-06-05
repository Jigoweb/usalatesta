/**
 * Vercel Function: proxy Vega token refresh.
 * No credentials needed — refresh_token from client is forwarded to Vega.
 * Kept server-side for consistency and to allow future rate-limiting.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const VEGA_BASE = process.env.VEGA_API_URL ?? 'https://api.vegasystem.org';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin ?? '';
  const allowed = [
    'https://app.usa-la-testa.it',
    'http://localhost:5173',
    'http://localhost:4173',
  ];
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { refresh_token } = (req.body ?? {}) as { refresh_token?: string };

  if (!refresh_token) {
    return res.status(400).json({ error: 'refresh_token mancante' });
  }

  try {
    const body = new URLSearchParams({ refresh_token });
    const upstream = await fetch(`${VEGA_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await upstream.json() as Record<string, unknown>;

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Refresh fallito' });
    }

    return res.status(200).json({
      access_token: data.access_token ?? data.accessToken,
      refresh_token: data.refresh_token ?? data.refreshToken,
      token_type: data.token_type ?? data.tokenType ?? 'bearer',
      expires_in: data.expires_in ?? data.expiresIn,
    });
  } catch (err) {
    console.error('[vega-refresh] Fetch error', err);
    return res.status(502).json({ error: 'Servizio non raggiungibile' });
  }
}
