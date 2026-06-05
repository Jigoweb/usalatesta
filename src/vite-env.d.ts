/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VEGA_API_URL?: string;
  readonly VITE_VEGA_WS_URL?: string;
  // VITE_VEGA_USER and VITE_VEGA_PASSWORD intentionally removed:
  // credentials are server-side only (Vercel Function env vars, no VITE_ prefix).
  readonly VITE_VEGA_ASSISTANT_ID?: string;
  readonly VITE_CHATBOT_COMING_SOON?: string;
  readonly VITE_GAMES_COMING_SOON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
