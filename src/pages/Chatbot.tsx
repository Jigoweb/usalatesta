import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import ComingSoonOverlay from '../components/ComingSoonOverlay';
import {
  buildUsalatestaConfig,
  getPartnerKey,
  isProductionOrigin,
  loadUsalatestaWidget,
  syncUsalatestaViewportHeight,
  unloadUsalatestaWidget,
  USALATESTA_PROD_ORIGIN,
  USALATESTA_ROOT_ID,
} from '../lib/usalatesta-widget';

const PRIVACY_CONSENT_KEY = 'usalatesta_chat_privacy_consent';
const CHATBOT_COMING_SOON = import.meta.env.VITE_CHATBOT_COMING_SOON === 'true';

/** BottomNav is h-16. Avoid Tailwind `inset-0` + `bottom-*` (inset can win). */
const SHELL_STYLE: CSSProperties = {
  top: 0,
  right: 0,
  left: 0,
  bottom: '4rem',
};

export default function Chatbot() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hasConsent, setHasConsent] = useState(
    () => localStorage.getItem(PRIVACY_CONSENT_KEY) === 'true'
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const partnerKey = getPartnerKey();
  const onProductionOrigin = isProductionOrigin();
  const isConfigured = Boolean(partnerKey);

  useEffect(() => {
    if (!hasConsent || CHATBOT_COMING_SOON || !partnerKey) return;

    setLoadError(null);
    let cancelled = false;

    loadUsalatestaWidget(buildUsalatestaConfig(partnerKey), { reload: true }).catch(
      (err: Error) => {
        if (!cancelled) {
          setLoadError(err.message || 'Errore nel caricamento del chatbot');
        }
      }
    );

    return () => {
      cancelled = true;
      unloadUsalatestaWidget();
    };
  }, [hasConsent, partnerKey]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !hasConsent || !isConfigured) return;
    return syncUsalatestaViewportHeight(el);
  }, [hasConsent, isConfigured]);

  const handleConsent = () => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, 'true');
    setHasConsent(true);
  };

  return (
    <div
      className="fixed bg-slate-50 flex flex-col overflow-hidden"
      style={SHELL_STYLE}
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
            su Vercel Production.
          </p>
        </div>
      )}

      {hasConsent && isConfigured && !onProductionOrigin && !loadError && (
        <div className="relative z-20 px-4 py-2 bg-amber-50 text-amber-900 text-sm border-b border-amber-200">
          Il chatbot di produzione risponde solo da{' '}
          <span className="font-medium">{USALATESTA_PROD_ORIGIN}</span>. Questo
          origin non è in whitelist APIM.
        </div>
      )}

      {loadError && (
        <div className="relative z-20 px-4 py-2 bg-red-50 text-red-800 text-sm border-b border-red-200">
          {loadError}
        </div>
      )}

      {hasConsent && isConfigured && (
        <div
          id={USALATESTA_ROOT_ID}
          ref={rootRef}
          className="relative z-10 flex-1 w-full min-h-0"
          style={
            {
              height: '100%',
              ['--ult-viewport-height' as string]: 'calc(100dvh - 4rem)',
            } as CSSProperties
          }
          aria-label="Chat Usa la Testa"
        />
      )}
    </div>
  );
}
