import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import ComingSoonOverlay from '../components/ComingSoonOverlay';

const PRIVACY_CONSENT_KEY = 'usalatesta_chat_privacy_consent';
const CHATBOT_COMING_SOON = import.meta.env.VITE_CHATBOT_COMING_SOON === 'true';

const ASSET_BASE =
  import.meta.env.VITE_USALATESTA_ASSET_BASE ??
  'https://blue-grass-07f595203.7.azurestaticapps.net';
const TOKEN_URL =
  import.meta.env.VITE_USALATESTA_TOKEN_URL ??
  'https://novoapim-dev-001.azure-api.net/usalatesta/generate';
const PARTNER_KEY = import.meta.env.VITE_USALATESTA_PARTNER_KEY ?? '';
const USE_MOCK = import.meta.env.VITE_USALATESTA_USE_MOCK === 'true';

const STYLE_ID = 'usalatesta-widget-css';
const SCRIPT_ID = 'usalatesta-widget-js';

const DEFAULT_QUICK_ACTIONS = [
  'Come imposto un limite di spesa?',
  'Quali sono i segnali di gioco problematico?',
];

declare global {
  interface Window {
    UsalatestaConfig?: {
      useMockTransport: boolean;
      directLineTokenUrl: string;
      partnerKey: string;
      sendStartConversationEvent: boolean;
      locale?: string;
      quickActions?: string[];
      enableVoice?: boolean;
      mountSelector?: string;
    };
  }
}

function parseQuickActions(): string[] {
  const raw = import.meta.env.VITE_USALATESTA_QUICK_ACTIONS;
  if (!raw?.trim()) return DEFAULT_QUICK_ACTIONS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
      return parsed;
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_QUICK_ACTIONS;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [hasConsent, setHasConsent] = useState(
    () => localStorage.getItem(PRIVACY_CONSENT_KEY) === 'true'
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const isConfigured = USE_MOCK || Boolean(PARTNER_KEY.trim());

  useEffect(() => {
    if (!hasConsent || !isConfigured) return;

    setLoadError(null);

    // Config must be on window before the ESM widget evaluates (read once, then frozen).
    window.UsalatestaConfig = {
      useMockTransport: USE_MOCK,
      directLineTokenUrl: TOKEN_URL,
      partnerKey: PARTNER_KEY,
      sendStartConversationEvent: true,
      locale: 'it-IT',
      quickActions: parseQuickActions(),
      enableVoice: false,
      mountSelector: '#usalatesta-root',
    };

    if (!document.getElementById(STYLE_ID)) {
      const link = document.createElement('link');
      link.id = STYLE_ID;
      link.rel = 'stylesheet';
      link.href = `${ASSET_BASE}/usalatesta.css`;
      document.head.appendChild(link);
    }

    // Cache-bust so SPA remounts re-run the auto-mounting ESM entry.
    document.getElementById(SCRIPT_ID)?.remove();
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'module';
    script.src = `${ASSET_BASE}/usalatesta.js?t=${Date.now()}`;
    script.onerror = () => {
      setLoadError('Impossibile caricare il chatbot. Riprova più tardi.');
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
      const root = document.getElementById('usalatesta-root');
      if (root) root.replaceChildren();
    };
  }, [hasConsent, isConfigured]);

  // Keep widget viewport height in sync with the slot above BottomNav (not 100vh).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !hasConsent || !isConfigured) return;

    const syncHeight = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) {
        el.style.setProperty('--ult-viewport-height', `${Math.round(h)}px`);
      }
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);
    window.addEventListener('resize', syncHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [hasConsent, isConfigured]);

  const handleConsent = () => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, 'true');
    setHasConsent(true);
  };

  // BottomNav is h-16 (4rem). Avoid `inset-0` + `bottom-*` (Tailwind can let inset win).
  const shellStyle: React.CSSProperties = {
    top: 0,
    right: 0,
    left: 0,
    bottom: '4rem',
  };

  return (
    <div
      className="fixed bg-slate-50 flex flex-col overflow-hidden"
      style={shellStyle}
    >
      <ComingSoonOverlay
        enabled={CHATBOT_COMING_SOON}
        icon={MessageSquare}
        title="Chatbot"
        zIndex={45}
      />

      {!hasConsent && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl">
                <ShieldCheck className="text-primary-blue" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Privacy e consenso
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              Per utilizzare il chatbot, è necessario acconsentire al
              trattamento dei tuoi dati. Le conversazioni vengono elaborate per
              fornirti risposte pertinenti sul gioco responsabile.
            </p>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              I tuoi dati saranno trattati in conformità con la nostra{' '}
              <span
                onClick={() => navigate('/privacy')}
                className="text-primary-blue underline hover:text-blue-900 cursor-pointer"
              >
                informativa sulla privacy
              </span>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Torna indietro
              </button>
              <button
                onClick={handleConsent}
                className="flex-1 px-4 py-2.5 bg-primary-blue text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors"
              >
                Acconsento
              </button>
            </div>
          </div>
        </div>
      )}

      {hasConsent && !isConfigured && (
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 text-center">
          <p className="text-sm text-gray-600">
            Chatbot non configurato. Imposta{' '}
            <code className="text-xs bg-gray-100 px-1 rounded">
              VITE_USALATESTA_PARTNER_KEY
            </code>{' '}
            oppure abilita il mock con{' '}
            <code className="text-xs bg-gray-100 px-1 rounded">
              VITE_USALATESTA_USE_MOCK=true
            </code>
            .
          </p>
        </div>
      )}

      {loadError && (
        <div className="relative z-10 px-4 py-2 bg-red-50 text-red-800 text-sm border-b border-red-200">
          {loadError}
        </div>
      )}

      {hasConsent && isConfigured && (
        <div
          id="usalatesta-root"
          ref={rootRef}
          className="relative z-10 flex-1 w-full min-h-0 h-full"
          style={
            {
              height: '100%',
              // Fallback before ResizeObserver; keeps composer above BottomNav (h-16).
              ['--ult-viewport-height' as string]: 'calc(100dvh - 4rem)',
            } as React.CSSProperties
          }
        />
      )}
    </div>
  );
}
