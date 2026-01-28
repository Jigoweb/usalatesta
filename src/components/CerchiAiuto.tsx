import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

const TELEFONO_VERDE = '800558822';
const TELEFONO_DISPLAY = '800 - 558822';

interface CerchiAiutoProps {
  /** Callback quando si clicca "Scopri i Centri Aiuto". Se non passato, naviga a /support/centers. */
  onScopriCentriClick?: () => void;
  /** Mostra il disclaimer DGA in fondo. Default true. */
  showDisclaimer?: boolean;
  /** ClassName aggiuntiva per il wrapper. */
  className?: string;
}

function PhoneCard({
  subtitle,
  title,
  href,
}: {
  subtitle: string;
  title: ReactNode;
  href: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col min-w-0">
      <span className="text-xs text-gray-400 mb-1">{subtitle}</span>
      <span className="text-sm sm:text-base font-bold text-gray-900 leading-tight mb-3 sm:mb-4">{title}</span>
      <a
        href={href}
        className="mt-auto rounded-full border-2 border-green-500 bg-white px-3 py-3 sm:px-4 sm:py-4 flex flex-col items-center justify-center gap-0.5 sm:gap-1 hover:bg-green-50/50 transition-colors active:scale-[0.98]"
      >
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-green-500 font-medium leading-tight">
          Telefono Verde Nazionale
        </span>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Phone size={22} className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-green-600 shrink-0" strokeWidth={2.5} />
          <span className="text-lg sm:text-xl font-bold text-green-700 tracking-tight">
            {TELEFONO_DISPLAY}
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-green-500 font-medium leading-tight text-center">
          Problematiche gioco d&apos;azzardo
        </span>
      </a>
    </div>
  );
}

export default function CerchiAiuto({
  onScopriCentriClick,
  showDisclaimer = true,
  className = '',
}: CerchiAiutoProps) {
  const navigate = useNavigate();

  const handleScopriCentri = () => {
    if (onScopriCentriClick) {
      onScopriCentriClick();
    } else {
      navigate('/support/centers');
    }
  };

  return (
    <section className={className}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Cerchi aiuto?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <PhoneCard
          subtitle="Istituto Superiore di Sanità"
          title={<>Numero Verde<br />Nazionale DGA</>}
          href={`tel:${TELEFONO_VERDE}`}
        />
        <PhoneCard
          subtitle="Konsumer Italia"
          title={<>Non Dipendo,<br />scelgo!</>}
          href={`tel:${TELEFONO_VERDE}`}
        />
      </div>

      <button
        type="button"
        onClick={handleScopriCentri}
        className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <MapPin size={22} className="text-gray-900 shrink-0" strokeWidth={2} />
        <span className="text-base font-bold text-gray-900">Scopri i Centri Aiuto</span>
      </button>

      {showDisclaimer && (
        <p className="text-sm text-gray-600 leading-relaxed mt-4">
          Il Disturbo da Gioco d&apos;Azzardo (DGA) è una dipendenza comportamentale, riconosciuta
          nei Livelli Essenziali di Assistenza dal Sistema Sanitario Nazionale, e deve essere
          affrontata da professionisti, esattamente come ogni altra dipendenza.
        </p>
      )}
    </section>
  );
}
