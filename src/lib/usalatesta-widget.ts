/**
 * Official "Usa la Testa" production chat widget.
 * Config MUST be on window before the module script is injected.
 * Never load the widget inside an iframe: APIM allowlists the host Origin.
 */

export const USALATESTA_PROD_ORIGIN = 'https://traeusalatesta0vr4.vercel.app';

export const USALATESTA_ASSET_BASE =
  'https://white-mud-0089d1403.5.azurestaticapps.net';

export const USALATESTA_DIRECT_LINE_TOKEN_URL =
  'https://novoapim-prod-001.azure-api.net/usalatesta/generate';

export const USALATESTA_ROOT_ID = 'usalatesta-root';
export const USALATESTA_STYLE_ID = 'usalatesta-widget-css';
export const USALATESTA_SCRIPT_ID = 'usalatesta-widget-js';

export const USALATESTA_QUICK_ACTIONS = [
  'Come imposto un limite di spesa?',
  'Quali sono i segnali di gioco problematico?',
] as const;

export interface UsalatestaConfig {
  useMockTransport: boolean;
  directLineTokenUrl: string;
  partnerKey: string;
  sendStartConversationEvent: boolean;
  locale: string;
  quickActions: string[];
  enableVoice: boolean;
  mountSelector: string;
}

declare global {
  interface Window {
    UsalatestaConfig?: UsalatestaConfig;
  }
}

let loadPromise: Promise<void> | null = null;

export function getPartnerKey(): string | undefined {
  const key = import.meta.env.VITE_USALATESTA_PARTNER_KEY;
  if (typeof key !== 'string') return undefined;
  const trimmed = key.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function isProductionOrigin(origin = window.location.origin): boolean {
  return origin === USALATESTA_PROD_ORIGIN;
}

export function buildUsalatestaConfig(partnerKey: string): UsalatestaConfig {
  return {
    useMockTransport: false,
    directLineTokenUrl: USALATESTA_DIRECT_LINE_TOKEN_URL,
    partnerKey,
    sendStartConversationEvent: true,
    locale: 'it-IT',
    quickActions: [...USALATESTA_QUICK_ACTIONS],
    enableVoice: false,
    mountSelector: `#${USALATESTA_ROOT_ID}`,
  };
}

export function applyUsalatestaConfig(config: UsalatestaConfig): void {
  window.UsalatestaConfig = config;
}

function ensureStyle(): void {
  if (document.getElementById(USALATESTA_STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = USALATESTA_STYLE_ID;
  link.rel = 'stylesheet';
  link.href = `${USALATESTA_ASSET_BASE}/usalatesta.css`;
  document.head.appendChild(link);
}

function injectModuleScript(): Promise<void> {
  document.getElementById(USALATESTA_SCRIPT_ID)?.remove();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = USALATESTA_SCRIPT_ID;
    script.type = 'module';
    // Cache-bust so SPA remounts re-run the auto-mounting ESM entry.
    script.src = `${USALATESTA_ASSET_BASE}/usalatesta.js?t=${Date.now()}`;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Impossibile caricare il widget Usa la Testa'));
    document.body.appendChild(script);
  });
}

/**
 * Declares window.UsalatestaConfig first, then injects CSS + module script.
 * Pass `{ reload: true }` when remounting the chatbot route.
 */
export function loadUsalatestaWidget(
  config: UsalatestaConfig,
  options?: { reload?: boolean }
): Promise<void> {
  if (!config.partnerKey) {
    return Promise.reject(new Error('partnerKey mancante'));
  }
  if (config.sendStartConversationEvent !== true) {
    return Promise.reject(
      new Error('sendStartConversationEvent deve essere true')
    );
  }

  applyUsalatestaConfig(config);

  if (options?.reload) {
    loadPromise = null;
  }

  if (!loadPromise) {
    ensureStyle();
    loadPromise = injectModuleScript().catch((err) => {
      loadPromise = null;
      throw err;
    });
  }
  return loadPromise;
}

export function unloadUsalatestaWidget(): void {
  document.getElementById(USALATESTA_SCRIPT_ID)?.remove();
  const root = document.getElementById(USALATESTA_ROOT_ID);
  root?.replaceChildren();
  loadPromise = null;
}

export function syncUsalatestaViewportHeight(el: HTMLElement): () => void {
  const apply = () => {
    const h = el.getBoundingClientRect().height;
    if (h > 0) {
      el.style.setProperty('--ult-viewport-height', `${Math.round(h)}px`);
    }
  };
  apply();
  const ro = new ResizeObserver(apply);
  ro.observe(el);
  window.addEventListener('resize', apply);
  return () => {
    ro.disconnect();
    window.removeEventListener('resize', apply);
  };
}

/** Test-only: reset singleton state. */
export function __resetUsalatestaWidgetForTests(): void {
  loadPromise = null;
  document.getElementById(USALATESTA_STYLE_ID)?.remove();
  document.getElementById(USALATESTA_SCRIPT_ID)?.remove();
  document.getElementById(USALATESTA_ROOT_ID)?.remove();
  delete window.UsalatestaConfig;
}
