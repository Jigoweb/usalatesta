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
        <h1 className="text-xl font-bold text-primary-blue">Informativa Privacy</h1>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-bold text-primary-blue mb-2">INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI</h2>
          <p className="mb-2">
            Ai sensi dell’art. 13 del Regolamento UE 679/2016 (di seguito "Regolamento" ovvero "GDPR"), La informiamo qui di seguito delle modalità e delle finalità con cui Novomatic Italia S.p.A., in qualità di titolare del trattamento, tratterà i Suoi dati personali (di seguito anche la "Società").
          </p>
          <p className="mb-2">
            I Suoi Dati Personali saranno trattati nel pieno rispetto dei principi di riservatezza, correttezza, necessità, pertinenza, liceità e trasparenza imposti dal Regolamento e con strumenti automatizzati e non automatizzati. Specifiche misure di sicurezza sono osservate per prevenire la perdita dei dati, usi illeciti o non corretti ed accessi non autorizzati agli stessi.
          </p>
          <p className="mb-4">
            Prima di utilizzare il chatbot AI integrato nell’app "Usa La Testa", La preghiamo di leggere attentamente la presente informativa.
          </p>
          <hr className="my-4 border-gray-200" />
          <p className="mb-2">
            Il trattamento sarà effettuato, in via principale, dall’organizzazione interna della Società sotto la direzione e il controllo delle funzioni aziendali preposte, ovvero da personale appositamente autorizzato come indicato al punto 5 che segue.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">1. Quali dati personali sono raccolti e trattati?</h3>
          <p className="mb-2">
            I Suoi dati personali oggetto di trattamento comprendono le informazioni eventualmente inserite nell’ambito delle interazioni con il chatbot AI presente nell’app "Usa La Testa", servizio progettato per fornire supporto informativo e contenuti dedicati ai temi del gioco responsabile e dell’utilizzo consapevole dei servizi offerti tramite l’applicazione.
          </p>
          <p className="mb-2">A titolo esemplificativo, possono rientrare in tale categoria:</p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>dati identificativi eventualmente forniti volontariamente dall’utente nell’ambito delle conversazioni;</li>
            <li>contenuti delle richieste e delle conversazioni effettuate tramite il chatbot;</li>
            <li>dati tecnici e di utilizzo del servizio (i.e. indirizzo IP, log tecnici, informazioni relative al dispositivo e al browser utilizzato);</li>
            <li>eventuali dati relativi all’utilizzo delle funzionalità vocali del chatbot.</li>
          </ul>
          <p>
            La invitiamo a non inserire, nell’ambito delle interazioni con il chatbot, categorie particolari di dati personali ai sensi dell’art. 9 del GDPR (quali, a titolo esemplificativo, dati relativi alla salute, convinzioni religiose o dati giudiziari), non essendo il servizio progettato per il trattamento di tali categorie di dati. La invitiamo inoltre a non inserire dati personali riferiti a soggetti terzi, credenziali di accesso, dati finanziari, informazioni riservate o ulteriori dati non pertinenti rispetto alle finalità del servizio.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">2. Per quali finalità del trattamento saranno trattati i miei dati personali?</h3>
          <p className="mb-2">
            Il trattamento dei dati personali eventualmente raccolti è effettuato al fine di consentire l’utilizzo del chatbot AI integrato nell’app "Usa La Testa", nonché di garantire il corretto funzionamento, la sicurezza e il supporto tecnico del servizio. In particolare, i Dati Personali potranno essere trattati per:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>gestire e riscontrare le richieste formulate tramite il chatbot;</li>
            <li>garantire la continuità operativa e la sicurezza del servizio;</li>
            <li>monitorare eventuali anomalie tecniche della piattaforma;</li>
            <li>fornire assistenza tecnica e supporto agli utenti.</li>
          </ul>
          <p>
            La base giuridica del trattamento per tali finalità è l’esecuzione di un servizio richiesto dall’utente ai sensi dell’art. 6, par. 1, lett. b) del GDPR, nonché il legittimo interesse della Società a garantire la sicurezza e il corretto funzionamento dei propri sistemi ai sensi dell’art. 6, par. 1, lett. f) del GDPR.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">3. Il conferimento dei dati è obbligatorio o facoltativo?</h3>
          <p>
            Il conferimento dei Suoi dati personali è facoltativo. Tuttavia, il trattamento di alcune informazioni risulta necessario per consentire l’utilizzo del chatbot AI e l’erogazione delle relative funzionalità. Pertanto, l’eventuale mancato conferimento dei dati non Le consentirà di utilizzare il chatbot.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">4. Come saranno trattati i miei dati personali e per quanto tempo saranno conservati?</h3>
          <p className="mb-2">
            I Suoi Dati Personali saranno trattati e conservati per il tempo strettamente necessario al perseguimento delle finalità sopra descritte. In particolare:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>i dati relativi alle conversazioni effettuate tramite il chatbot saranno conservati per un termine massimo di 30 giorni dalla relativa interazione;</li>
            <li>i log tecnici e i dati relativi alla sicurezza e al funzionamento del servizio saranno conservati per un termine massimo di 12 mesi.</li>
          </ul>
          <p>
            Trascorsi tali termini, i Dati Personali saranno cancellati o anonimizzati.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">5. Quali soggetti potranno venire a conoscenza dei miei dati personali?</h3>
          <p className="mb-2">
            Possono venire a conoscenza dei Suoi dati personali i nostri dipendenti e collaboratori, nominati quali autorizzati del trattamento e debitamente istruiti al corretto trattamento dei dati personali con riguardo al rispetto delle misure di sicurezza e agli obblighi di riservatezza. Si precisa che i dati personali da noi raccolti non saranno, in ogni caso, oggetto di diffusione.
          </p>
          <p className="mb-2">
            Potranno venire a conoscenza dei Suoi dati personali le seguenti categorie di soggetti, che, in qualità di responsabili del trattamento ex art. 28 GDPR, ci forniscono servizi strumentali allo svolgimento della nostra attività: fornitori di servizi informatici; fornitori di servizi gestionali; fornitori di servizi amministrativi; professionisti esterni e consulenti; società del Gruppo Novomatic che forniscono servizi infragruppo.
          </p>
          <p>
            Precisiamo, infine, che i Suoi dati personali saranno trattati unicamente all’interno dello Spazio Economico Europeo.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">6. Quali sono i miei diritti?</h3>
          <p className="mb-2">
            Lei ha il diritto di esercitare, in qualsiasi momento, gratuitamente e senza formalità, i seguenti diritti di cui agli artt. da 15 a 22 del Regolamento: il diritto di chiedere l'accesso ai dati personali (ovvero il diritto di ottenere da noi la conferma che sia o meno in corso un trattamento di dati che La riguardano e, in tal caso, di ottenere l'accesso ai dati personali, ottenendone copia, ed alle informazioni di cui all’art. 15 del Regolamento), la rettifica (ovvero il diritto di ottenere la rettifica dei dati inesatti che La riguardano o l'integrazione dei dati incompleti), la cancellazione (ovvero il diritto di ottenere la cancellazione dei dati che La riguardano, se sussiste uno dei motivi indicati dall’art. 17 del Regolamento), la limitazione del trattamento (ovvero il diritto di ottenere, nei casi indicati dall’art. 18 del Regolamento, il contrassegno dei dati conservati con l'obiettivo di limitarne il trattamento in futuro), oltre al diritto alla portabilità dei dati (ovvero il diritto, nei casi indicati dall’art. 20 del Regolamento, di ricevere da noi, in un formato strutturato, di uso comune e leggibile da dispositivo automatico i dati che La riguardano, nonché di trasmettere tali dati a un altro titolare del trattamento senza impedimenti).
          </p>
          <p>
            Le ricordiamo che ha sempre la possibilità di proporre un reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it) o alla diversa Autorità di controllo dello Stato Membro dell’Unione Europea in cui Lei risiede o lavora.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">7. Il Regolamento mi riconosce anche il diritto di oppormi al trattamento?</h3>
          <p>
            Si, Lei ha il diritto di opporsi in qualsiasi momento, per motivi connessi alla sua situazione particolare, al trattamento dei dati personali che la riguardano ai sensi dell'articolo 6, paragrafo 1, lettere e) o f) del Regolamento.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">8. Come posso contattarvi ed esercitare i miei diritti?</h3>
          <p className="mb-2">
            Le richieste di esercizio dei Suoi diritti, come sopra indicati, dovranno essere presentate utilizzando il modello per l’esercizio dei diritti in materia di protezione dei dati personali disponibile all’indirizzo <a href="https://www.garanteprivacy.it/home/modulistica-e-servizi-online" target="_blank" rel="noreferrer" className="text-primary-blue underline">https://www.garanteprivacy.it/home/modulistica-e-servizi-online</a>.
          </p>
          <p className="mb-2">
            Tale modello, debitamente compilato ed indirizzato al titolare del trattamento, dovrà essere inviato all’indirizzo <a href="mailto:privacy@novomatic.it" className="text-primary-blue underline">privacy@novomatic.it</a> ovvero a mezzo posta al seguente indirizzo:
          </p>
          <address className="not-italic pl-4 border-l-2 border-gray-200 text-gray-600">
            Novomatic Italia S.p.A.<br />
            Via Galla Placidia n. 2<br />
            47922 - Rimini (RN)<br />
            c.a: Responsabile della Protezione dei Dati.
          </address>
        </section>

        <section>
          <h3 className="font-semibold text-primary-blue mb-1">9. Come posso contattare il vostro Responsabile della Protezione dei Dati?</h3>
          <p className="mb-2">
            Il Gruppo Novomatic Italia ha nominato il proprio Responsabile della Protezione dei Dati che può essere contattato inviando la Sua richiesta all’indirizzo <a href="mailto:dataprotection@novomatic.it" className="text-primary-blue underline">dataprotection@novomatic.it</a> o, ancora, tramite posta elettronica certificata all’indirizzo <a href="mailto:dponovomatic@postaleg.it" className="text-primary-blue underline">dponovomatic@postaleg.it</a> oppure inviando la comunicazione a mezzo posta al seguente indirizzo:
          </p>
          <address className="not-italic pl-4 border-l-2 border-gray-200 text-gray-600">
            Novomatic Italia S.p.A.<br />
            Via Galla Placidia n. 2<br />
            47922 - Rimini (RN)<br />
            c.a: Responsabile della Protezione dei Dati.
          </address>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 text-center">
          <p className="font-bold mb-1">NOVOMATIC ITALIA S.p.A. con socio unico</p>
          <p>Sede legale: Via Benedetto Croce 122-124 • 00142 Roma (RM) • Italy • Europe • Tel. +39 06 526 239 01 • Fax +39 06 526 239 408</p>
          <p>Sede amm.va e operativa: Via Galla Placidia 2 • 47922 Rimini (RN) • Italy • Europe • Tel. +39 0541 420 611 • Fax +39 0541 420 699</p>
          <p>P.I. di Gruppo n. 15851041002 • C.F. e Iscr. Reg. Imp. di Roma n. 03677960407 • Numero R.E.A. RM - 1268859</p>
          <p>Capitale Sociale € 9.000.000,00 (i.v.) • PEC: <a href="mailto:nispa@postaleg.it" className="underline">nispa@postaleg.it</a> • <a href="mailto:info@novomatic.it" className="underline">info@novomatic.it</a> • <a href="https://www.novomatic.it" target="_blank" rel="noreferrer" className="underline">www.novomatic.it</a></p>
          <p className="mt-2">Soggetta a direzione e coordinamento di Novomatic AG • P.I. 210/7796 e Iscrizione Registro Imprese n. FN 69548b</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;