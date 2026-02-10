import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import manualePdf from '../dati/Codice-di-Gioco-Responsabile.pdf';
import CerchiAiuto from '../components/CerchiAiuto';

export default function Support() {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-primary-blue mb-4">Informazioni utili</h2>

          <a
            href={manualePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:bg-gray-50 transition-colors mb-6"
          >
            <span className="font-bold text-gray-900">Scarica il manuale</span>
            <ChevronRight size={20} className="text-gray-600 shrink-0" />
          </a>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Hai bisogno di supporto? Non sei solo.</h3>
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            Se senti che il tuo rapporto con il gioco sta diventando difficile da gestire, esistono servizi dedicati che possono offrirti ascolto, orientamento e aiuto concreto.
            Mettersi in contatto con professionisti può essere un passo importante verso maggiore serenità.
          </p>

          <CerchiAiuto
            onScopriCentriClick={() => navigate('/support/centers')}
            showDisclaimer={false}
            className="mb-6"
          />

          <div className="space-y-3 mb-6">
            {/* Numero Verde Nazionale */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleItem('numero-verde')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-left pr-4">
                  Numero Verde Nazionale per il Gioco d&apos;Azzardo Problematico – 800 558 822
                </span>
                {expandedItems.has('numero-verde') ? (
                  <ChevronUp size={20} className="text-gray-600 shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600 shrink-0" />
                )}
              </button>
              {expandedItems.has('numero-verde') && (
                <div className="px-4 pb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Un servizio gratuito e anonimo gestito dall&apos;Istituto Superiore di Sanità, dedicato alle problematiche legate al Disturbo da Gioco d&apos;Azzardo. Attivo su tutto il territorio nazionale, con operatori qualificati che possono fornirti informazioni e indicazioni utili, è accessibile a tutti i cittadini che richiedono assistenza e consulenza in materia.
                  </p>
                </div>
              )}
            </div>

            {/* Sportelli Konsumer Italia */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleItem('konsumer')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-left pr-4">
                  Sportelli di ascolto dell&apos;Associazione Konsumer Italia
                </span>
                {expandedItems.has('konsumer') ? (
                  <ChevronUp size={20} className="text-gray-600 shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600 shrink-0" />
                )}
              </button>
              {expandedItems.has('konsumer') && (
                <div className="px-4 pb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Punti di riferimento sul territorio per ricevere supporto, consulenza e orientamento in caso di difficoltà legate al gioco. Gli operatori possono aiutarti a comprendere la situazione e indirizzarti verso i servizi più adatti a te. Il servizio si rivolge in particolar modo alle famiglie e ai giocatori attraverso l&apos;ausilio di un punto d&apos;ascolto e di psicologi specializzati, mirato ad affrontare un percorso virtuoso di contrasto alla dipendenza.
                  </p>
                </div>
              )}
            </div>

            {/* SerD regionali */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleItem('serd')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-left pr-4">
                  SerD regionali
                </span>
                {expandedItems.has('serd') ? (
                  <ChevronUp size={20} className="text-gray-600 shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600 shrink-0" />
                )}
              </button>
              {expandedItems.has('serd') && (
                <div className="px-4 pb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Tramite questa app puoi localizzare sulla mappa i SerD (i servizi pubblici per le dipendenze patologiche del Sistema Sanitario Nazionale) più vicini a te. I servizi territoriali offrono percorsi personalizzati, gestiti da professionisti esperti, per affrontare eventuali problematiche legate al gioco d&apos;azzardo.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary-blue/5 border-l-4 border-primary-blue rounded-r-xl p-5 mt-8">
            <p className="text-gray-900 text-base leading-relaxed font-semibold">
              Ricordati: chiedere aiuto è un atto di consapevolezza e di cura verso te stesso.
              Siamo qui per accompagnarti in un percorso di gioco responsabile e sereno.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}