import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, ChevronRight } from 'lucide-react';
import numeroVerdeImg from '../assets/images/immagine-numero.png';
import manualePdf from '../dati/Codice-di-Gioco-Responsabile.pdf';
import CerchiAiuto from '../components/CerchiAiuto';

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Informazioni utili - reference */}
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

          <p className="text-gray-900 text-base leading-relaxed mb-4">
            In tutti i 100 Paesi al mondo in cui è presente, il gruppo NOVOMATIC opera per garantire
            ai propri clienti divertimento e intrattenimento responsabili. I nostri sforzi mirano ad
            offrire massimo supporto ai giocatori, fornendo loro suggerimenti per un rapporto
            responsabile e controllato con il gioco.
          </p>
          <p className="text-gray-900 text-base leading-relaxed">
            ADMIRAL Gaming Network opera nel mercato del gioco legale e sicuro, regolato da ADM,
            proponendo ai propri consumatori un servizio di intrattenimento conforme ad un modello
            sostenibile, che garantisce: il rispetto del divieto di gioco ai minori; la comunicazione
            trasparente delle probabilità di vincita per ciascuna tipologia di gioco, rendendo certo
            l&apos;ammontare e l&apos;erogazione delle vincite; la prevenzione di comportamenti di
            gioco eccessivo, divulgando materiale informativo e fornendo assistenza; la sicurezza dei
            sistemi e delle piattaforme.
          </p>
        </section>

        <CerchiAiuto onScopriCentriClick={() => navigate('/support/centers')} />
      </div>
    </div>
  );
}