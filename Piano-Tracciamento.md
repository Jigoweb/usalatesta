# Piano di Implementazione Tracciamento Analytics e Pubblicitario - PWA "Usa la Testa"

Il presente documento illustra la strategia e le azioni necessarie per implementare correttamente il sistema di tracciamento degli utenti e degli eventi all'interno dell'applicazione "Usa la Testa".

Poiché l'applicazione è sviluppata come una PWA (Progressive Web App) e verrà distribuita sia sul Web che sugli Store ufficiali (Google Play Store e Apple App Store), la configurazione richiede accorgimenti specifici per garantire la correttezza dei dati raccolti nel rispetto delle policy di privacy.

---

## 1. Architettura Generale del Tracciamento

Tutto il tracciamento verrà gestito in maniera centralizzata attraverso l'inserimento del **Google Tag Manager (GTM)** nel codice dell'applicazione web. Questo approccio permette di:
- Evitare di inserire SDK nativi (codici pesanti e complessi) all'interno dell'app.
- Gestire e modificare i tag (Google Analytics 4, Meta Pixel, Google Ads) senza dover rilasciare nuovi aggiornamenti sugli store.
- Assicurare che la logica tracciante del sito web venga ereditata automaticamente dalle versioni Android e iOS.

---

## 2. Gestione delle Piattaforme (Web vs Android vs iOS)

Per evitare che i dati di traffico provenienti dalle tre fonti si mescolino in Google Analytics 4 (impedendo di capire da dove arrivano gli utenti), applicheremo una distinzione alla fonte.

In fase di pacchettizzazione dell'app per gli store, imposteremo dei parametri specifici di provenienza (UTM) all'avvio dell'app:
- **Utenti Android:** Verranno tracciati automaticamente con origine `app_android`.
- **Utenti iOS:** Verranno tracciati automaticamente con origine `app_ios`.
- **Utenti Web:** Verranno tracciati in base alla loro provenienza naturale (motori di ricerca, social, diretto, ecc.).

---

## 3. Gestione della Privacy e Limitazioni iOS (Apple ITP)

Le app iOS "wrappate" (PWA all'interno di una WKWebView) sono soggette alle rigide regole di privacy di Apple. Questo significa che i cookie di tracciamento utilizzati da Meta e Google potrebbero essere cancellati rapidamente, rendendo difficile il riconoscimento dello stesso utente a distanza di giorni.

**Azioni previste:**
- Per **Google Analytics 4**: I dati aggregati e anonimi verranno raccolti regolarmente.
- Per **Meta e Google Ads**: Laddove possibile (es. se in futuro l'utente dovesse inserire un'email o un dato riconoscibile), implementeremo tecnologie di tracciamento lato server (Server-Side) e "Conversioni Avanzate" per limitare la dispersione dei dati pubblicitari causata dal blocco dei cookie.
- **Dichiarazioni Store**: In fase di pubblicazione sull'App Store, dovrà essere compilata con precisione la scheda sulla Privacy, dichiarando l'utilizzo di dati per finalità Analitiche e Pubblicitarie.

---

## 4. Elenco degli Eventi Tracciati

L'applicazione è stata mappata in modo da intercettare le azioni chiave degli utenti. Per ogni azione, l'app invierà un segnale ("evento") ai sistemi di analisi.

### 4.1. Area Test e Autovalutazione
L'obiettivo è misurare quante persone iniziano il test, come progrediscono e quanti lo portano a termine.
- **Apertura Test (GA4, Meta, GAds):** Traccia il click sul pulsante che apre l'introduzione al test.
- **Avvio Test (GA4, Meta, GAds):** Traccia il momento in cui l'utente clicca su "Inizia il test".
- **Avanzamento Test (Solo GA4):** Registra il passaggio dell'utente da una domanda all'altra, specificando a quale step è arrivato.
- **Completamento Test (GA4, Meta, GAds):** Registra la conclusione del test, inviando in modo anonimo la fascia di punteggio ottenuta dall'utente.

### 4.2. Area Supporto e Centri
L'obiettivo è misurare l'interesse degli utenti verso la richiesta di aiuto reale.
- **Click su Supporto (GA4, Meta, GAds):** Traccia l'apertura della sezione dedicata alle informazioni di supporto.
- **Ricerca Centri (GA4, Meta, GAds):** Traccia il click sul pulsante "Scopri centri" per accedere alla mappa/lista.
- **Chiamata al Centro (Solo GA4):** Registra l'intenzione dell'utente di chiamare un centro specifico (cliccando sul numero di telefono), associando al dato la Regione e il Comune del centro selezionato.
- **Apertura Mappe (GA4, Meta, GAds):** Registra il click sull'indirizzo fisico di un centro per aprire le mappe, associando Regione e Comune.

### 4.3. Funzionalità Timer (Countdown)
- **Avvio Timer (GA4, Meta, GAds):** Traccia l'avvio del timer di gioco, registrando i minuti impostati dall'utente.
- **Fine Timer (Solo GA4):** Registra il momento in cui il timer si conclude, distinguendo se è terminato naturalmente o se è stato interrotto manualmente dall'utente.

### 4.4. Chatbot, Giochi e Blog
- **Invio Messaggio Chat (GA4, Meta, GAds):** Previsto nel catalogo (`chat_messageSend`). Con il widget embed attuale non è disponibile un hook lato host sull’invio messaggio: l’evento resta riservato e andrà ripristinato quando il kit espone callback/eventi (senza tracciare il contenuto del messaggio).
- **Avvio Esperienza/Gioco (GA4, Meta, GAds):** Registra quando un utente avvia uno dei mini-giochi (es. Il Cervello o il Labirinto), specificando il nome del gioco.
- **Conclusione Esperienza (Solo GA4):** Registra il momento in cui l'utente porta a termine il gioco.
- **Lettura Blog (Solo GA4):** Traccia il click sul pulsante "Leggi Altro" al termine di un articolo, per misurare l'engagement sui contenuti testuali.

---

## 5. Attività Operative da Svolgere (Checklist)

1. **Configurazione Google Analytics 4 (GA4):**
   - Registrazione manuale nel pannello di amministrazione dei parametri personalizzati (es. Punteggio test, Numero di step, Regione, Comune, Nome gioco, Tempo impostato). Senza questo passaggio, GA4 raccoglierà i dati ma non li mostrerà nei report.
2. **Configurazione Google Tag Manager (GTM):**
   - Creazione dei contenitori e generazione degli script.
   - Creazione di tutti i Tag, Attivatori e Variabili per smistare i segnali tra GA4, Meta e Google Ads.
3. **Integrazione del Codice (Sviluppo):**
   - Inserimento del sistema di tracciamento delle visualizzazioni di pagina (Virtual Pageviews) per garantire che l'app, essendo una Single Page Application, comunichi ogni cambio di schermata.
   - Inserimento di tutti i trigger degli eventi mappati (vedi punto 4) all'interno dei componenti dell'app.
   - Implementazione di funzioni di ritardo per i pulsanti di uscita (Telefono e Mappe) per garantire che l'evento venga registrato prima che il telefono apra l'app esterna.
4. **Configurazione in fase di Build (PWABuilder):**
   - Inserimento dei parametri UTM di provenienza negli URL di avvio per Android e iOS.
