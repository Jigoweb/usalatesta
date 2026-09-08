/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USALATESTA_PARTNER_KEY?: string;
  readonly VITE_CHATBOT_COMING_SOON?: string;
  readonly VITE_GAMES_COMING_SOON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
