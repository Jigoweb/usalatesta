# Guida all'Integrazione del Test di Autovalutazione su WordPress

Questo documento spiega come integrare in modo semplice e veloce il Test di Autovalutazione "Usa la Testa" all'interno di qualsiasi sito web WordPress. L'integrazione avviene tramite un semplice codice Iframe, progettato per essere sicuro, responsive e ottimizzato.

## Il Codice da Copiare

Copia per intero il seguente blocco di codice:

```html
<iframe 
  src="https://usa-la-testa.it/quiz?embed=true" 
  style="width: 100%; height: 600px; border: none; border-radius: 12px; max-width: 100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" 
  allow="autoplay; fullscreen" 
  loading="lazy"
  title="Test di Autovalutazione - Usa la Testa"
></iframe>
```

---

## Istruzioni di Inserimento per WordPress

A seconda del builder che utilizzi per comporre le pagine del tuo sito web, segui i passaggi corrispondenti:

### 1. Gutenberg (L'editor a blocchi predefinito di WordPress)
1. Apri la pagina o l'articolo in cui vuoi inserire il test.
2. Clicca sul pulsante **"+"** per aggiungere un nuovo blocco.
3. Cerca il blocco **"HTML personalizzato"** (Custom HTML) e cliccaci per aggiungerlo alla pagina.
4. Incolla il codice iframe (che hai copiato sopra) all'interno del campo di testo.
5. Clicca su **"Anteprima"** nel blocco per verificare che il test venga caricato correttamente.
6. Salva o aggiorna la pagina.

### 2. Elementor
1. Apri la pagina desiderata e clicca su **"Modifica con Elementor"**.
2. Nel pannello di sinistra, cerca il widget **"HTML"**.
3. Trascina il widget "HTML" nella colonna o sezione in cui vuoi che appaia il test.
4. Nel pannello di sinistra (sotto la scheda "Contenuto"), incolla il codice iframe all'interno del campo "Codice HTML".
5. Il test dovrebbe apparire immediatamente nell'editor. Clicca su **"Aggiorna"** in basso a sinistra per salvare.

### 3. WPBakery Page Builder
1. Modifica la pagina e clicca su **"Add Element"** (Aggiungi Elemento).
2. Cerca e seleziona l'elemento **"Raw HTML"** (HTML Grezzo).
3. Passa il mouse sull'elemento appena creato e clicca sull'icona della matita per modificarlo.
4. Incolla il codice iframe all'interno della finestra che si apre.
5. Clicca su **"Save changes"** (Salva modifiche) e aggiorna la pagina.

---

## Note Tecniche e Risoluzione dei Problemi (Troubleshooting)

- **Responsività:** L'impostazione `width: 100%` assicura che il test si adatti automaticamente e in modo fluido a schermi di smartphone, tablet e PC, mantenendo sempre un layout ottimale. L'altezza è fissata a `600px` ma il layout interno del test ha uno scroll nativo.
- **Performance (Lazy Loading):** Abbiamo integrato l'attributo `loading="lazy"`, che fa in modo che il test venga caricato dal browser solo quando l'utente scorre la pagina fino a raggiungerlo. Questo evita di appesantire i tempi di caricamento (Core Web Vitals) del tuo sito.
- **Sicurezza e Privacy:** I dati degli utenti e i tracciamenti avvengono in completa sicurezza sui server di *Usa la Testa*. Non vi è alcun impatto sul database del tuo sito WordPress.
- **Plugin di Cache:** Se, dopo aver inserito il codice e salvato, non riesci a visualizzare il test (es. vedi uno spazio vuoto), è probabile che il plugin di cache del tuo sito (es. WP Rocket, W3 Total Cache) abbia memorizzato la versione vecchia della pagina. **Svuota la cache** del sito web e aggiorna la pagina per risolvere.
- **Navigazione:** Quando il test viene caricato in modalità *embed* (ossia sul tuo sito), la classica barra di navigazione in alto dell'App viene nascosta in automatico, mentre rimarrà ben visibile la barra di avanzamento del quiz.
