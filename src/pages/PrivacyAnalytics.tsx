import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyAnalytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-6 h-6 text-primary-blue" />
        </button>
        <h1 className="text-xl font-bold text-primary-blue">Informativa privacy</h1>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-lg font-bold text-primary-blue mb-2">INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI</h2>
        <p className="mb-2">Ai sensi dell’art. 13 del Regolamento UE 679/2016 (di seguito “Regolamento” ovvero “GDPR”), La informiamo qui di seguito delle modalità e delle finalità con cui Novomatic Italia S.p.A., in qualità di titolare del trattamento, (di seguito anche la “Società”) tratterà i Suoi dati personali nell’ambito dell’utilizzo dell’app “Usa La Testa”.</p>
        <p className="mb-2">Prima di utilizzare l’app, La preghiamo di leggere attentamente la presente informativa.</p>
        <hr className="my-4 border-gray-200" />
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">Quali dati personali sono raccolti e trattati?</h3>
        <p className="mb-2">Nell’ambito dell’utilizzo dell’app “Usa La Testa”, applicazione sviluppata per promuovere il gioco responsabile attraverso strumenti di autovalutazione, contenuti informativi, funzionalità di supporto e orientamento ai servizi di assistenza, la Società può trattare alcune informazioni relative alle modalità di utilizzo dell’applicazione e delle relative funzionalità.</p>
        <p className="mb-2">A titolo esemplificativo, possono essere trattati:</p>
        <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>cookie e altri identificativi tecnici online utilizzati per il funzionamento degli strumenti di analisi e misurazione installati sull’app;</li>
            <li>indirizzo IP (opportunamente anonimizzato) e informazioni tecniche relative al dispositivo, al browser e alla connessione utilizzata;</li>
            <li>informazioni relative al sistema operativo, alla lingua del browser e ad altre caratteristiche tecniche dell’app;</li>
            <li>dati relativi all’utilizzo delle funzionalità dell’app (ad es. avvio e completamento di specifiche sezioni, consultazione dei contenuti, utilizzo del timer o delle funzionalità di supporto);</li>
            <li>dati relativi all’interazione con campagne promozionali e di comunicazione della Società, nonché informazioni necessarie alla misurazione dell’efficacia delle campagne effettuate mediante gli strumenti di analytics e advertising utilizzati.</li>
        </ul>
        <p className="mb-2">(di seguito anche “Dati Personali”).</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">Per quali finalità del trattamento saranno trattati i miei dati personali?</h3>
        <p className="mb-2">I Suoi Dati Personali potranno essere trattati per le seguenti finalità:</p>
        <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>i trattamenti strettamente necessari al funzionamento dell’applicazione, alla sicurezza, alla prevenzione di anomalie tecniche e alla corretta erogazione delle funzionalità richieste dall’utente sono effettuati sulla base del legittimo interesse del Titolare ai sensi dell’art. 6, par. 1, lett. f) GDPR, consistente nel garantire la sicurezza, l’integrità e il corretto funzionamento dell’applicazione.</li>
            <li>previo Suo consenso, per analizzare, anche in forma aggregata, le modalità di utilizzo dell’app e delle sue funzionalità, misurarne le prestazioni, monitorarne il corretto funzionamento, elaborare statistiche di utilizzo, valutare l’efficacia degli strumenti messi a disposizione dell’utente nell’ambito della promozione del gioco responsabile e migliorare l’esperienza di utilizzo dell’applicazione (Finalità Analytics);</li>
            <li>previo Suo consenso, per misurare l’efficacia delle campagne promozionali e di comunicazione della Società, analizzare le modalità di interazione degli utenti con tali campagne e ottimizzare le future attività di comunicazione e advertising mediante gli strumenti messi a disposizione dai relativi provider (Finalità Advertising).</li>
        </ul>
        <p className="mb-2">La base giuridica del trattamento per entrambe le finalità sopra indicate è il consenso dell’interessato ai sensi dell’art. 6, par. 1, lett. a) del GDPR.</p>
        <p className="mb-2">Il consenso potrà essere revocato in qualsiasi momento senza pregiudicare la liceità del trattamento effettuato prima della revoca.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">Il conferimento dei dati è obbligatorio o facoltativo?</h3>
        <p className="mb-2">Il conferimento dei dati personali per le finalità di cui al precedente punto 2 è facoltativo. L'eventuale mancato conferimento del consenso non pregiudicherà la possibilità di utilizzare l’app e le relative funzionalità principali, ma non consentirà alla Società di raccogliere informazioni statistiche sull'utilizzo dell'applicazione.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">4.Come saranno trattati i miei dati personali e per quanto tempo saranno conservati?</h3>
        <p className="mb-2">I Suoi Dati Personali saranno trattati nel pieno rispetto dei principi di riservatezza, correttezza, necessità, pertinenza, liceità e trasparenza imposti dal Regolamento e con strumenti automatizzati e non automatizzati. Specifiche misure di sicurezza sono osservate per prevenire la perdita dei dati, usi illeciti o non corretti ed accessi non autorizzati agli stessi.</p>
        <p className="mb-2">Il trattamento sarà effettuato dall’organizzazione interna della Società e da soggetti appositamente autorizzati o nominati responsabili del trattamento.</p>
        <p className="mb-2">L'utilizzo degli strumenti di analytics e di misurazione delle campagne ha esclusivamente finalità statistiche, di analisi dell'utilizzo dell'applicazione e di valutazione dell'efficacia delle attività di comunicazione della Società.</p>
        <p className="mb-2">I Suoi Dati Personali saranno trattati e conservati per il tempo strettamente necessario al perseguimento delle finalità sopra descritte.  In particolare:</p>
        <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>i dati trattati per finalità di Analytics saranno conservati per un periodo non superiore a 14 mesi dalla raccolta;</li>
            <li>i dati trattati per finalità di Advertising saranno conservati per un periodo non superiore a 14 mesi dalla raccolta.</li>
        </ul>
        <p className="mb-2">Trascorsi tali termini, i Dati Personali saranno cancellati o anonimizzati.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">5. Quali soggetti potranno venire a conoscenza dei miei dati personali?</h3>
        <p className="mb-2">Possono venire a conoscenza dei Suoi dati personali i nostri dipendenti e collaboratori, nominati quali autorizzati del trattamento e debitamente istruiti al corretto trattamento dei dati personali con riguardo al rispetto delle misure di sicurezza e agli obblighi di riservatezza. Si precisa che i dati personali da noi raccolti non saranno, in ogni caso, oggetto di diffusione.</p>
        <p className="mb-2">Potranno venire a conoscenza dei Suoi dati personali le seguenti categorie di soggetti, che, in qualità di responsabili del trattamento ex art. 28 GDPR, ci forniscono servizi strumentali allo svolgimento della nostra attività: fornitori di servizi informatici; fornitori di servizi gestionali; fornitori di servizi amministrativi; professionisti esterni e consulenti; società del Gruppo Novomatic che forniscono servizi infragruppo.</p>
        <p className="mb-2">Alcuni dei soggetti sopra indicati possono trattare dati personali al di fuori dello Spazio Economico Europeo. In tali casi il trasferimento avverrà nel rispetto degli artt. 44 e seguenti del GDPR e sulla base delle garanzie previste dalla normativa applicabile.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">6. Quali sono i miei diritti?</h3>
        <p className="mb-2">Lei ha il diritto di esercitare, in qualsiasi momento, gratuitamente e senza formalità, i seguenti diritti di cui agli artt. da 15 a 22 del Regolamento: il diritto di chiedere l'accesso ai dati personali (ovvero il diritto di ottenere da noi  la conferma che sia o meno in corso un trattamento di dati che La riguardano e, in tal caso, di ottenere l'accesso ai dati personali, ottenendone copia, ed alle informazioni di cui all’art. 15 del Regolamento), la rettifica (ovvero il diritto di ottenere la rettifica dei dati inesatti che La riguardano o l'integrazione dei dati incompleti), la cancellazione (ovvero il diritto di ottenere la  cancellazione dei dati che La riguardano, se sussiste uno dei motivi indicati dall’art. 17 del Regolamento), la limitazione del trattamento (ovvero il diritto di ottenere, nei casi indicati dall’art. 18 del Regolamento, il contrassegno dei dati conservati con l'obiettivo di limitarne il trattamento in futuro), oltre al diritto alla portabilità dei dati (ovvero il diritto, nei casi indicati dall’art. 20 del Regolamento, di ricevere da noi, in un formato strutturato, di uso comune e leggibile da dispositivo automatico i dati che La riguardano, nonché di trasmettere tali dati a un altro titolare del trattamento senza impedimenti).</p>
        <p className="mb-2">Lei ha, altresì, il diritto di revocare il Suo consenso in qualsiasi momento senza pregiudicare la liceità del trattamento basata sul consenso prestato prima della revoca.</p>
        <p className="mb-2">Le ricordiamo che ha sempre la possibilità di proporre un reclamo al Garante per la protezione dei dati personali <a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer" className="text-primary-blue underline">www.garanteprivacy.it</a> o alla diversa Autorità di controllo dello Stato Membro dell’Unione Europea in cui Lei risiede o lavora.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">7.Come posso contattarvi ed esercitare i miei diritti?</h3>
        <p className="mb-2">Le richieste di esercizio dei Suoi diritti, come sopra indicati, dovranno essere presentate utilizzando il modello per l’esercizio dei diritti in materia di protezione dei dati personali disponibile all’indirizzo <a href="https://www.garanteprivacy.it/home/modulistica-e-servizi-online" target="_blank" rel="noreferrer" className="text-primary-blue underline">https://www.garanteprivacy.it/home/modulistica-e-servizi-online</a>.</p>
        <p className="mb-2">Tale modello, debitamente compilato ed indirizzato al titolare del trattamento, dovrà essere inviato all’indirizzo <a href="mailto:privacy@novomatic.it" className="text-primary-blue underline">privacy@novomatic.it</a> ovvero a mezzo posta al seguente indirizzo:</p>
        <address className="not-italic pl-4 border-l-2 border-gray-200 text-gray-600 mb-2">
            Novomatic Italia S.p.A.<br />
            Via Galla Placidia n. 2<br />
            47922 - Rimini (RN)<br />
            c.a: Responsabile della Protezione dei Dati.
        </address>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">8.Come posso contattare il vostro Responsabile della Protezione dei Dati?</h3>
        <p className="mb-2">Il Gruppo Novomatic Italia ha nominato il proprio Responsabile della Protezione dei Dati che può essere contattato tramite posta elettronica certificata all’indirizzo <a href="mailto:dponovomatic@postaleg.it" className="text-primary-blue underline">dponovomatic@postaleg.it</a> oppure inviando la comunicazione a mezzo posta al seguente indirizzo:</p>
        <address className="not-italic pl-4 border-l-2 border-gray-200 text-gray-600 mb-2">
            Novomatic Italia S.p.A.<br />
            Via Galla Placidia n. 2<br />
            47922 - Rimini (RN)<br />
            c.a: Responsabile della Protezione dei Dati.
        </address>
      </div>
    </div>
  );
};

export default PrivacyAnalytics;
