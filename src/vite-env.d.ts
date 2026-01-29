/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VEGA_API_URL?: string;
  readonly VITE_VEGA_WS_URL?: string;
  readonly VITE_VEGA_USER?: string;
  readonly VITE_VEGA_PASSWORD?: string;
  readonly VITE_VEGA_ASSISTANT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
