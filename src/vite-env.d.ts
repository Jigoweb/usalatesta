/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USALATESTA_ASSET_BASE?: string;
  readonly VITE_USALATESTA_TOKEN_URL?: string;
  readonly VITE_USALATESTA_PARTNER_KEY?: string;
  readonly VITE_USALATESTA_USE_MOCK?: string;
  readonly VITE_USALATESTA_QUICK_ACTIONS?: string;
  readonly VITE_CHATBOT_COMING_SOON?: string;
  readonly VITE_GAMES_COMING_SOON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
