import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import telVerdeImg from '../assets/images/immagine-numero.png';
import tel661501Img from '../assets/images/numero-verde-661501.jpg';

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
  imageSrc,
  imageAlt,
}: {
  subtitle: string;
  title: ReactNode;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 pt-4 pb-0 sm:px-5 sm:pt-5 sm:pb-0 flex flex-col min-w-0">
      <span className="text-xs text-gray-400 mb-1">{subtitle}</span>
      <span className="text-sm sm:text-base font-normal text-gray-900 leading-tight mb-3 sm:mb-4">{title}</span>
      <div className="mt-auto w-full">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-20 sm:h-24 object-contain"
        />
      </div>
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <PhoneCard
          subtitle="Istituto Superiore di Sanità"
          title={<>Numero Verde<br />Nazionale DGA</>}
          imageSrc={telVerdeImg}
          imageAlt="Numero Verde Nazionale DGA"
        />
        <PhoneCard
          subtitle="Konsumer Italia"
          title={<>Non Dipendo,<br />scelgo!</>}
          imageSrc={tel661501Img}
          imageAlt="Numero Verde 800 661501"
        />
      </div>

      <button
        type="button"
        onClick={handleScopriCentri}
        className="w-full bg-primary-blue text-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-center gap-3 transition-colors"
      >
        <MapPin size={22} className="shrink-0" strokeWidth={2} />
        <span className="text-base font-bold">Scopri i Centri Aiuto</span>
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
