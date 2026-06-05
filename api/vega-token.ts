/**
 * Vercel Function: proxy Vega token endpoint.
 * Credentials (VEGA_USER, VEGA_PASSWORD) live server-side only — never exposed to client.
 * Client POSTs here, receives {access_token, refresh_token}, never sees the password.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const VEGA_BASE = process.env.VEGA_API_URL ?? 'https://api.vegasystem.org';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — same-origin for production, allow localhost in dev
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

  const username = process.env.VEGA_USER;
  const password = process.env.VEGA_PASSWORD;

  if (!username || !password) {
    console.error('[vega-token] Missing VEGA_USER or VEGA_PASSWORD env vars');
    return res.status(503).json({ error: 'Chatbot non configurato' });
  }

  try {
    const body = new URLSearchParams({ username, password });
    const upstream = await fetch(`${VEGA_BASE}/api/v1/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await upstream.json() as Record<string, unknown>;

    if (!upstream.ok) {
      console.error('[vega-token] Upstream error', upstream.status, data);
      return res.status(upstream.status).json({ error: 'Autenticazione fallita' });
    }

    // Forward only the token fields — never echo back credentials
    return res.status(200).json({
      access_token: data.access_token ?? data.accessToken,
      refresh_token: data.refresh_token ?? data.refreshToken,
      token_type: data.token_type ?? data.tokenType ?? 'bearer',
      expires_in: data.expires_in ?? data.expiresIn,
    });
  } catch (err) {
    console.error('[vega-token] Fetch error', err);
    return res.status(502).json({ error: 'Servizio non raggiungibile' });
  }
}
