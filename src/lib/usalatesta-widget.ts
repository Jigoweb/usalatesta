/**
 * Official "Usa la Testa" production chat widget.
 * Config MUST be on window before the module script is injected.
 * Never load the widget inside an iframe: APIM allowlists the host Origin.
 *
 * The widget ESM entry auto-boots once. Nested modules (src/widget.js) are
 * cached by URL, so re-injecting usalatesta.js?t=… does NOT re-run boot().
 * Keep a persistent #usalatesta-root and park/reattach it across SPA navigations.
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

const PARKED_ROOT_ATTR = 'data-usalatesta-parked';

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
let persistentRoot: HTMLDivElement | null = null;

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
  const existing = document.getElementById(USALATESTA_SCRIPT_ID);
  if (existing) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = USALATESTA_SCRIPT_ID;
    script.type = 'module';
    // Stable URL: the entry and its nested imports must stay cached so the
    // auto-boot runs exactly once; remounts rely on attach/detach instead.
    script.src = `${USALATESTA_ASSET_BASE}/usalatesta.js`;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Impossibile caricare il widget Usa la Testa'));
    document.body.appendChild(script);
  });
}

/**
 * Declares window.UsalatestaConfig first, then injects CSS + module script once.
 */
export function loadUsalatestaWidget(config: UsalatestaConfig): Promise<void> {
  if (!config.partnerKey) {
    return Promise.reject(new Error('partnerKey mancante'));
  }
  if (config.sendStartConversationEvent !== true) {
    return Promise.reject(
      new Error('sendStartConversationEvent deve essere true')
    );
  }

  applyUsalatestaConfig(config);

  if (!loadPromise) {
    ensureStyle();
    loadPromise = injectModuleScript().catch((err) => {
      loadPromise = null;
      throw err;
    });
  }
  return loadPromise;
}

export function getOrCreateUsalatestaRoot(): HTMLDivElement {
  if (persistentRoot?.isConnected) return persistentRoot;

  const existing = document.getElementById(USALATESTA_ROOT_ID);
  if (existing instanceof HTMLDivElement) {
    persistentRoot = existing;
    return existing;
  }

  const el = document.createElement('div');
  el.id = USALATESTA_ROOT_ID;
  el.style.width = '100%';
  el.style.height = '100%';
  el.style.minHeight = '0';
  persistentRoot = el;
  return el;
}

/** Move the persistent root into the chatbot host so React unmounts do not destroy it. */
export function attachUsalatestaRoot(host: HTMLElement): HTMLDivElement {
  const root = getOrCreateUsalatestaRoot();
  root.removeAttribute(PARKED_ROOT_ATTR);
  root.style.removeProperty('display');
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.minHeight = '0';
  if (root.parentElement !== host) {
    host.appendChild(root);
  }
  return root;
}

/** Park the root off the chatbot page without destroying the widget instance. */
export function detachUsalatestaRoot(): void {
  const root =
    persistentRoot ??
    (document.getElementById(USALATESTA_ROOT_ID) as HTMLDivElement | null);
  if (!root) return;
  root.setAttribute(PARKED_ROOT_ATTR, 'true');
  root.style.display = 'none';
  if (root.parentElement !== document.body) {
    document.body.appendChild(root);
  }
}

export function syncUsalatestaViewportHeight(el: HTMLElement): () => void {
  const apply = () => {
    const h = el.getBoundingClientRect().height;
    if (h > 0) {
      el.style.setProperty('--ult-viewport-height', `${Math.round(h)}px`);
      const root = document.getElementById(USALATESTA_ROOT_ID);
      root?.style.setProperty('--ult-viewport-height', `${Math.round(h)}px`);
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
  persistentRoot = null;
  document.getElementById(USALATESTA_STYLE_ID)?.remove();
  document.getElementById(USALATESTA_SCRIPT_ID)?.remove();
  document.getElementById(USALATESTA_ROOT_ID)?.remove();
  delete window.UsalatestaConfig;
}
