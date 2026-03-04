import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-6 h-6 text-primary-blue" />
        </button>
        <h1 className="text-2xl font-bold text-primary-blue">Privacy Policy</h1>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-primary-blue mb-2">Privacy – Informazioni per l’Utente</h2>
          <p>
            Benvenuto nell’app “Usa La Testa”, sviluppata da Novomatic Italia S.p.A.<br />
            Prima di iniziare, ti invitiamo a leggere attentamente queste informazioni e regole d’uso.<br />
            Il proseguimento nell’utilizzo dell’app implica la presa visione e l’accettazione delle presenti condizioni.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">1. Finalità e caratteristiche del servizio</h3>
          <p>
            L’app è destinata esclusivamente a utenti maggiorenni (18+) e ha l’obiettivo di promuovere una cultura del
            gioco responsabile, favorendo la prevenzione di comportamenti potenzialmente dannosi.
          </p>
          <p className="mt-2">Pertanto:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>non è richiesta alcuna registrazione;</li>
            <li>non vengono raccolti né memorizzati dati personali dell’utente;</li>
            <li>le funzionalità interattive sono utilizzate in forma completamente anonima.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">2. Funzionalità di geolocalizzazione</h3>
          <p>
            Per mostrarti i centri di aiuto più vicini, l’app potrà richiedere l’autorizzazione all’uso della posizione GPS.
          </p>
          <p className="mt-2">Preme in questa sede specificare che:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>
              la tua posizione non viene salvata né inviata ai server di Novomatic Italia S.p.A. L’informazione
              viene utilizzata solo dal tuo dispositivo, esclusivamente per individuare i centri di supporto nelle vicinanze;
            </li>
            <li>
              eventuali dati possono essere trattati dalle applicazioni di navigazione del tuo dispositivo (i.e.
              Google Maps / Mappe di iOS/ Waze), secondo le loro rispettive informative sul trattamento dei dati
              personali.
            </li>
          </ul>
          <p className="mt-2">
            L’eventuale consenso alla geolocalizzazione ti verrà richiesto solo se deciderai di utilizzare la funzione
            “mappa”.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">3. Assistenza e contatti</h3>
          <p>
            Per chiarimenti sull’utilizzo dell’app o sulle presenti informazioni, puoi contattarci a:<br />
            Ufficio Privacy: <a href="mailto:privacy@novomatic.it" className="text-blue-600 underline">privacy@novomatic.it</a>
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">4. Dichiarazione di presa visione</h3>
          <p>
            Dichiaro di aver letto, compreso e accettato le presenti informazioni, ai fini di un corretto utilizzo
            dell’app “Usa La Testa”.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
