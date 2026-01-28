import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, MapPin } from 'lucide-react';
import manualePdf from '../dati/Codice-di-Gioco-Responsabile.pdf';

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Manual Download */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <a 
              href={manualePdf} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between group"
            >
              <h2 className="text-xl font-bold text-gray-800">Scarica il manuale</h2>
              <ChevronLeft className="rotate-180 text-gray-800" size={24} />
            </a>
        </div>

        <div className="text-gray-600 text-sm leading-relaxed space-y-4">
            <p>
                In tutti i 100 Paesi al mondo in cui è presente, il gruppo NOVOMATIC opera per garantire ai propri clienti divertimento e intrattenimento responsabili. I nostri sforzi mirano ad offrire massimo supporto ai giocatori, fornendo loro suggerimenti per un rapporto responsabile e controllato con il gioco.
            </p>
            <p>
                ADMIRAL Gaming Network opera nel mercato del gioco legale e sicuro, regolato da ADM, proponendo ai propri consumatori un servizio di intrattenimento conforme ad un modello sostenibile, che garantisce: il rispetto del divieto di gioco ai minori; la comunicazione trasparente delle probabilità di vincita per ciascuna tipologia di gioco, rendendo certo l’ammontare e l’erogazione delle vincite; la prevenzione di comportamenti di gioco eccessivo, divulgando materiale informativo e fornendo assistenza; la sicurezza dei sistemi e delle piattaforme.
            </p>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-2xl font-bold text-gray-800">Cerchi aiuto?</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Numero Verde Nazionale DGA */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
               <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Istituto Superiore di Sanità</span>
                  <h4 className="text-base font-bold text-gray-900 leading-tight mb-6">Numero Verde<br/>Nazionale DGA</h4>
               </div>
               <a href="tel:800558822" className="flex items-center border border-green-500 rounded-xl overflow-hidden group">
                  <div className="bg-green-500 p-2 flex items-center justify-center">
                      <Phone className="text-white fill-current" size={20} />
                  </div>
                  <div className="flex-1 text-center py-2">
                      <span className="text-[8px] block text-green-600 font-bold uppercase tracking-tighter leading-none mb-0.5">TELEFONO VERDE NAZIONALE</span>
                      <span className="text-lg font-bold text-green-600 block leading-none">800 - 558822</span>
                      <span className="text-[6px] block text-green-600 font-bold uppercase tracking-tighter leading-none mt-0.5">PROBLEMATICHE GIOCO D'AZZARDO</span>
                  </div>
               </a>
            </div>
            
            {/* Konsumer Italia */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
               <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Konsumer Italia</span>
                  <h4 className="text-base font-bold text-gray-900 leading-tight mb-6">Non Dipendo,<br/>scelgo!</h4>
               </div>
               <a href="tel:800558822" className="flex items-center border border-green-500 rounded-xl overflow-hidden group">
                  <div className="bg-green-500 p-2 flex items-center justify-center">
                      <Phone className="text-white fill-current" size={20} />
                  </div>
                  <div className="flex-1 text-center py-2">
                      <span className="text-[8px] block text-green-600 font-bold uppercase tracking-tighter leading-none mb-0.5">TELEFONO VERDE NAZIONALE</span>
                      <span className="text-lg font-bold text-green-600 block leading-none">800 - 558822</span>
                      <span className="text-[6px] block text-green-600 font-bold uppercase tracking-tighter leading-none mt-0.5">PROBLEMATICHE GIOCO D'AZZARDO</span>
                  </div>
               </a>
            </div>
          </div>
        </div>

        {/* Centers Banner */}
        <div 
          onClick={() => navigate('/support/centers')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 cursor-pointer flex items-center space-x-4"
        >
            <MapPin size={24} className="text-gray-900" />
            <h2 className="text-xl font-bold text-gray-900">Scopri i Centri Aiuto</h2>
        </div>
        
        <p className="text-[10px] text-gray-500 leading-tight mt-6">
            Il Disturbo da Gioco d'Azzardo (DGA) è una dipendenza comportamentale, riconosciuta nei Livelli Essenziali di Assistenza dal Sistema Sanitario Nazionale, e deve essere affrontata da professionisti, esattamente come ogni altra dipendenza.
        </p>
      </div>
    </div>
  );
}