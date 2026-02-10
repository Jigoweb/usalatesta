import { LucideIcon } from 'lucide-react';

interface ComingSoonOverlayProps {
  enabled: boolean;
  icon: LucideIcon;
  title: string;
  zIndex?: number;
}

export default function ComingSoonOverlay({ enabled, icon: Icon, title, zIndex = 40 }: ComingSoonOverlayProps) {
  if (!enabled) return null;

  return (
    <div className={`fixed inset-0 bg-white flex flex-col`} style={{ zIndex }}>
      {/* Header con titolo */}
      <div className="pt-4 pb-8 text-center">
        <h1 className="text-gray-400 text-lg font-medium">{title}</h1>
      </div>
      
      {/* Contenuto centrale */}
      <div className="flex-1 flex items-center justify-center pb-24">
        <div className="text-center px-8">
          <div className="mb-8 flex justify-center">
            <Icon className="w-32 h-32 text-gray-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Presto disponibile</h2>
          <p className="text-gray-600 text-base">
            Stiamo lavorando per portarti questa funzionalità al più presto.
          </p>
        </div>
      </div>
    </div>
  );
}
