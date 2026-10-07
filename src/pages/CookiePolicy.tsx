import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-6 h-6 text-primary-blue" />
        </button>
        <h1 className="text-xl font-bold text-primary-blue">Cookie Policy</h1>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-lg font-bold text-primary-blue mb-2">COOKIE POLICY</h2>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">1. COSA SONO I COOKIE</h3>
        <p className="mb-2">La presente Cookie Policy descrive l’eventuale utilizzo di cookie, strumenti analoghi e altre tecnologie di tracciamento nell’ambito dell’app “Usa La Testa” (di seguito, l’“App”), dedicata alla promozione del gioco responsabile e alla prevenzione di comportamenti potenzialmente dannosi legati al gaming.</p>
        <p className="mb-2">La presente Cookie Policy è redatta in conformità al Regolamento (UE) 2016/679 (“GDPR”), alla Direttiva 2002/58/CE (c.d. ePrivacy), nonché alle Linee guida del Garante per la protezione dei dati personali in materia di cookie e altri strumenti di tracciamento. Per “cookie” e “strumenti analoghi” si intendono tecnologie che possono consentire la memorizzazione di informazioni sul dispositivo dell’utente o l’accesso a informazioni già archiviate sullo stesso, anche nell’ambito di web app fruibili tramite browser.</p>
        <p className="mb-2">L’App non richiede la registrazione dell’utente e le funzionalità interattive sono concepite per essere utilizzate in forma anonima. L’App può tuttavia utilizzare tecnologie strettamente necessarie al funzionamento del servizio e, ove previsto, può richiedere l’autorizzazione all’uso della posizione del dispositivo esclusivamente per consentire all’utente di individuare i centri di supporto più vicini tramite la funzione “mappa”.</p>
        <p className="mb-2">I cookie e gli strumenti analoghi non consentono, di per sé, di identificare direttamente l’utente. Tuttavia, in determinate circostanze, le informazioni raccolte tramite tali tecnologie potrebbero essere associate ad altri dati riferibili all’utente e costituire quindi dati personali ai sensi della normativa applicabile in materia di protezione dei dati personali.</p>
        <p className="mb-2">Eventuali tecnologie di tracciamento potrebbero essere installate direttamente tramite l’App oppure da soggetti terzi che forniscono servizi o funzionalità integrati nella stessa, quali, a titolo esemplificativo, servizi di mappatura o navigazione accessibili tramite browser o tramite applicazioni presenti sul dispositivo dell’utente. Tali servizi terzi operano secondo le rispettive informative privacy e le impostazioni applicabili del browser, del dispositivo e/o del sistema operativo utilizzato.</p>
        <p className="mb-2">La presente Cookie Policy illustra le categorie di tecnologie eventualmente utilizzate dalla App, le relative finalità, le modalità di gestione del consenso e delle autorizzazioni e gli strumenti a disposizione dell’utente per controllarne l’utilizzo.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">2. TITOLARE DEL TRATTAMENTO</h3>
        <p className="mb-2">Il Titolare del trattamento dei dati personali raccolti tramite cookie è:</p>
        <address className="not-italic pl-4 border-l-2 border-gray-200 text-gray-600 mb-2">
            NOVOMATIC ITALIA S.p.A.<br />
            Via Galla Placidia n. 2<br />
            47922 Rimini (RN)<br />
            E-mail: <a href="mailto:privacy@novomatic.it" className="text-primary-blue underline">privacy@novomatic.it</a>
        </address>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">3. RESPONSABILE DELLA PROTEZIONE DEI DATI</h3>
        <p className="mb-2">Il Responsabile della Protezione dei Dati (Data Protection Officer - DPO) è contattabile tramite posta elettronica certificata all’indirizzo <a href="mailto:dponovomatic@postaleg.it" className="text-primary-blue underline">dponovomatic@postaleg.it</a>.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">4. TIPOLOGIE DI COOKIE UTILIZZATE</h3>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">4.1 Cookie tecnici</h3>
        <p className="mb-2">L’App può utilizzare cookie tecnici, indispensabili per consentire il corretto funzionamento del servizio e la fruizione delle funzionalità richieste dall’utente. Tali tecnologie possono consentire, tra l’altro, la navigazione all’interno dell’App, la corretta visualizzazione dei contenuti informativi, il mantenimento delle impostazioni strettamente funzionali all’utilizzo del servizio e l’implementazione delle misure di sicurezza necessarie a prevenire utilizzi impropri o malfunzionamenti.</p>
        <p className="mb-2">L’utilizzo di tali tecnologie è necessario per l’erogazione del servizio richiesto dall’utente e per il corretto funzionamento della App.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">4.2 Cookie di preferenza</h3>
        <p className="mb-2">L’App può memorizzare preferenze strettamente funzionali all’esperienza dell’utente, quali impostazioni di visualizzazione o scelte effettuate durante la navigazione, ove necessarie a rendere più agevole l’utilizzo delle funzionalità disponibili. Qualora tali tecnologie non siano strettamente necessarie all’erogazione del servizio richiesto, il loro utilizzo avverrà esclusivamente previo consenso dell’utente o, ove pertinente, previa autorizzazione tramite le impostazioni del browser, del dispositivo e/o del sistema operativo utilizzato.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">4.3 Cookie analitici</h3>
        <p className="mb-2">L’App può utilizzare cookie analitici o altri strumenti di misurazione, anche forniti da terze parti, per raccogliere informazioni statistiche sull’utilizzo del servizio, monitorarne le prestazioni, individuare eventuali problematiche tecniche e migliorare la fruizione dei contenuti e delle funzionalità disponibili, inclusa l’esperienza di navigazione all’interno della App.</p>
        <p className="mb-2">Tali strumenti possono consentire la raccolta di informazioni relative, a titolo esemplificativo, al numero di accessi, alle schermate o pagine consultate, ai percorsi di navigazione, ai tempi di permanenza, alle interazioni con le funzionalità informative e, ove tecnicamente rilevanti, ad alcuni dati relativi al dispositivo, al browser, al sistema operativo e alle prestazioni del servizio. Le informazioni così raccolte sono utilizzate esclusivamente per finalità di analisi statistica, sicurezza, monitoraggio tecnico e miglioramento dell’App.</p>
        <p className="mb-2">I cookie analitici e gli altri strumenti di misurazione sono configurati, ove tecnicamente possibile, mediante misure volte a ridurre l’identificabilità dell’utente, quali l’anonimizzazione o il mascheramento dell’indirizzo IP, la limitazione delle finalità di trattamento, la disattivazione di funzionalità pubblicitarie o di condivisione dei dati non necessarie e, ove applicabile, l’assenza di incrocio con altre informazioni nella disponibilità del fornitore del servizio. Qualora tali tecnologie non siano strettamente necessarie all’erogazione del servizio richiesto, il loro utilizzo avverrà esclusivamente previo consenso dell’utente o, ove pertinente, previa autorizzazione tramite le impostazioni del browser, del dispositivo e/o del sistema operativo utilizzato.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">4.4 Geolocalizzazione e servizi di mappatura</h3>
        <p className="mb-2">Per mostrare all’utente i centri di aiuto più vicini, la App può richiedere l’autorizzazione all’uso della posizione del dispositivo esclusivamente qualora l’utente decida di utilizzare la funzione “mappa”. Tuttavia, la posizione non viene salvata né inviata ai server di Novomatic Italia S.p.A., ma viene utilizzata, ove tecnicamente possibile, tramite il browser e/o il dispositivo dell’utente al solo fine di individuare i centri di supporto nelle vicinanze.</p>
        <p className="mb-2">L’utilizzo della geolocalizzazione è facoltativo e subordinato all’autorizzazione dell’utente tramite le impostazioni del browser, del dispositivo e/o del sistema operativo utilizzato. L’utente può negare o revocare tale autorizzazione in qualsiasi momento; in tal caso, la funzione di individuazione dei centri più vicini potrebbe non essere disponibile o risultare limitata. Eventuali dati trattati da servizi di mappatura, applicazioni di navigazione o altri servizi terzi attivati dall’utente tramite la App sono regolati dalle rispettive informative privacy e condizioni d’uso.</p>
        <p className="mb-2">Il trattamento dei dati mediante strumenti tecnici si basa sull’art. 6, par. 1, lett. b) del GDPR, ove necessario all’erogazione del servizio richiesto, mentre per le ulteriori tecnologie eventualmente soggette a consenso la base giuridica è l’art. 6, par. 1, lett. a) del GDPR.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">5. GESTIONE DEL CONSENSO E DELLE PREFERENZE COOKIE</h3>
        <p className="mb-2">Per le funzionalità dell’App che richiedono specifiche autorizzazioni, quali l’accesso alla posizione del dispositivo, l’utente può gestire le proprie preferenze tramite le impostazioni del browser, del dispositivo e/o del sistema operativo utilizzato.</p>
        <p className="mb-2">L’eventuale richiesta di autorizzazione alla geolocalizzazione viene presentata solo quando l’utente sceglie di utilizzare la funzione “mappa”. L’utente può autorizzare, negare o revocare l’accesso alla posizione secondo le modalità previste dal browser, dal dispositivo e/o dal sistema operativo utilizzato.</p>
        <p className="mb-2">Qualora l’App dovesse in futuro utilizzare cookie o altri strumenti di tracciamento non strettamente necessari, l’utente sarà informato mediante appositi strumenti e potrà esprimere, modificare o revocare il proprio consenso secondo modalità semplici e accessibili.</p>
        <p className="mb-2">La revoca del consenso o delle autorizzazioni non pregiudica la liceità dei trattamenti effettuati prima della revoca stessa e produce effetti esclusivamente per il futuro.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">6. ELENCO DEI COOKIE UTILIZZATI</h3>
        <p className="mb-2">L’elenco dettagliato e costantemente aggiornato dei cookie e degli altri strumenti di tracciamento effettivamente utilizzati sarà disponibile attraverso il pannello di gestione del consenso accessibile dall’utente tramite il cookie banner implementato sulla App mediante la piattaforma Cookiebot e/o mediante l’apposita sezione dedicata ai cookie.</p>
        <p className="mb-2">Per ciascun cookie o altro strumento di tracciamento vengono rese disponibili, ove applicabili, informazioni relative a: denominazione del cookie; soggetto che lo installa, distinguendo tra cookie di prima parte e cookie di terze parti; categoria di appartenenza; finalità perseguita; durata di conservazione; eventuale trasferimento di dati personali verso Paesi situati al di fuori dello Spazio Economico Europeo; eventuali collegamenti alle informative privacy dei fornitori terzi.</p>
        <p className="mb-2">Le informazioni contenute nel pannello di gestione del consenso sono aggiornate periodicamente al fine di riflettere le effettive tecnologie utilizzate e garantire agli utenti un’informativa completa e trasparente sull’impiego dei cookie e degli altri strumenti di tracciamento.</p>
        <p className="mb-2">Qualora l’utilizzo dei cookie o degli altri strumenti di tracciamento comporti il trasferimento di dati personali verso Paesi situati al di fuori dello Spazio Economico Europeo, tale trasferimento avviene nel rispetto delle condizioni e delle garanzie previste dagli articoli 44 e seguenti del GDPR.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">7. GESTIONE DELLE AUTORIZZAZIONI</h3>
        <p className="mb-2">L’utente può configurare in qualsiasi momento le impostazioni del browser, del dispositivo e/o del sistema operativo utilizzato per autorizzare, limitare o revocare l’accesso alla posizione e alle altre eventuali autorizzazioni richieste dalla App. Le modalità di gestione possono variare in funzione del browser, del dispositivo, del sistema operativo e della relativa versione in uso.</p>
        <p className="mb-2">In linea generale, l’utente può gestire tali autorizzazioni accedendo alle impostazioni del browser e/o del dispositivo utilizzato e modificando le autorizzazioni relative, tra l’altro, alla posizione.</p>
        <p className="mb-2">La mancata autorizzazione o la revoca dell’accesso alla posizione non impedisce, di regola, l’utilizzo delle altre funzionalità informative della App, ma può limitare o impedire l’uso della funzione di individuazione dei centri di supporto più vicini.</p>
        <h3 className="font-semibold text-primary-blue mb-1 mt-2">8. AGGIORNAMENTI DELLA COOKIE POLICY</h3>
        <p className="mb-2">La presente Cookie Policy potrà essere soggetta a modifiche e aggiornamenti nel tempo, in particolare in relazione a intervenute modifiche normative e regolamentari, all’evoluzione delle tecnologie utilizzate, nonché all’introduzione di nuovi servizi o funzionalità all’interno della App, e ne verrà data adeguata evidenza agli utenti secondo le modalità previste dalla normativa applicabile.</p>
      </div>
    </div>
  );
};

export default CookiePolicy;
