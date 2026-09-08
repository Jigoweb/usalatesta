import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import ComingSoonOverlay from '../components/ComingSoonOverlay';
import {
  attachUsalatestaRoot,
  buildUsalatestaConfig,
  detachUsalatestaRoot,
  getPartnerKey,
  isProductionOrigin,
  loadUsalatestaWidget,
  USALATESTA_PROD_ORIGIN,
} from '../lib/usalatesta-widget';

const PRIVACY_CONSENT_KEY = 'usalatesta_chat_privacy_consent';
const CHATBOT_COMING_SOON = import.meta.env.VITE_CHATBOT_COMING_SOON === 'true';

export default function Chatbot() {
  const navigate = useNavigate();
  const hostRef = useRef<HTMLDivElement>(null);
  const [hasConsent, setHasConsent] = useState(
    () => localStorage.getItem(PRIVACY_CONSENT_KEY) === 'true'
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const partnerKey = getPartnerKey();
  const onProductionOrigin = isProductionOrigin();

  useEffect(() => {
    if (!hasConsent || CHATBOT_COMING_SOON) return;

    const host = hostRef.current;
    if (!host) return;

    if (!partnerKey) {
      setLoadError(
        'Configurazione chatbot incompleta: manca VITE_USALATESTA_PARTNER_KEY.'
      );
      return;
    }

    attachUsalatestaRoot(host);
    let cancelled = false;

    loadUsalatestaWidget(buildUsalatestaConfig(partnerKey)).catch((err: Error) => {
      if (!cancelled) {
        setLoadError(err.message || 'Errore nel caricamento del chatbot');
      }
    });

    return () => {
      cancelled = true;
      detachUsalatestaRoot();
    };
  }, [hasConsent, partnerKey]);

  const handleConsent = () => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, 'true');
    setHasConsent(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden">
      <ComingSoonOverlay
        enabled={CHATBOT_COMING_SOON}
        icon={MessageSquare}
        title="Chatbot"
        zIndex={45}
      />

      {!hasConsent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
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

      {hasConsent && !onProductionOrigin && !loadError && partnerKey && (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-amber-50 text-amber-900 text-sm border-b border-amber-200">
          Il chatbot di produzione risponde solo da{' '}
          <span className="font-medium">{USALATESTA_PROD_ORIGIN}</span>. Questo
          origin non è in whitelist APIM.
        </div>
      )}

      {loadError && (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-red-50 text-red-800 text-sm border-b border-red-200">
          {loadError}
        </div>
      )}

      <div
        ref={hostRef}
        className="fixed inset-x-0 top-0 bottom-16 z-10 overflow-hidden bg-slate-50 [transform:translateZ(0)] [isolation:isolate]"
        aria-label="Chat Usa la Testa"
      />
    </div>
  );
}
