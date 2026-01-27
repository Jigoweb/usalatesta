# USA LA TESTA - Gioco Responsabile

Applicazione PWA per la sensibilizzazione sul gioco d'azzardo responsabile.

## Stack Tecnologico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **PWA**: Vite PWA Plugin + Workbox

## Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn

## Installazione e Avvio Locale

1. **Installa le dipendenze**
   ```bash
   npm install
   ```

2. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

3. **Apri il browser**
   - Il server sarà disponibile su `http://localhost:5173` (o un'altra porta se quella è occupata)
   - Vite mostrerà l'URL esatto nel terminale

## Test su Dispositivo Mobile

Essendo un'app mobile-first, puoi testarla come se fossi su un dispositivo mobile in diversi modi:

### 1. Modalità Dispositivo nei DevTools del Browser (Consigliato)

1. Apri l'app nel browser (`http://localhost:5173`)
2. Apri gli **Strumenti per sviluppatori** (F12 o Cmd+Option+I su Mac)
3. Clicca sull'icona **Toggle device toolbar** (Cmd+Shift+M su Mac) o usa il menu "Toggle device emulation"
4. Seleziona un dispositivo dalla lista (iPhone, iPad, Android, ecc.) o imposta dimensioni personalizzate
5. L'app si adatterà alle dimensioni del dispositivo selezionato

**Browser supportati:**
- Chrome/Edge: Strumenti per sviluppatori → Toggle device toolbar
- Firefox: Strumenti per sviluppatori → Responsive Design Mode (Cmd+Option+M)
- Safari: Sviluppo → Mostra User Agent personalizzato

### 2. Accesso da Dispositivo Mobile Reale sulla Stessa Rete

Per testare su un dispositivo mobile reale:

1. **Avvia il server con accesso di rete locale:**
   ```bash
   npm run dev:mobile
   ```
   Questo script avvia il server accessibile dalla rete locale (equivalente a `npm run dev -- --host`)

2. **Trova il tuo indirizzo IP locale:**
   - Mac/Linux: `ifconfig | grep "inet "` o `ipconfig getifaddr en0`
   - Windows: `ipconfig` e cerca "IPv4 Address"

3. **Accedi dal dispositivo mobile:**
   - Assicurati che il dispositivo sia sulla stessa rete WiFi
   - Apri il browser sul dispositivo e vai a `http://TUO_IP:5173` (es. `http://192.168.1.100:5173`)

### 3. Test PWA su Dispositivo Mobile

Per testare le funzionalità PWA (installazione, offline, ecc.):

1. Usa il metodo 2 per accedere da dispositivo mobile reale
2. Apri l'app nel browser mobile
3. Il browser dovrebbe offrire l'opzione "Aggiungi alla schermata home" / "Installa app"
4. Una volta installata, l'app funzionerà come un'app nativa

### 4. Strumenti Avanzati

- **ngrok**: Espone il server locale su internet per test da qualsiasi dispositivo
  ```bash
  npx ngrok http 5173
  ```
- **Chrome DevTools Remote Debugging**: Debug remoto su dispositivi Android connessi via USB

## Script Disponibili

- `npm run dev` - Avvia il server di sviluppo con hot-reload (solo localhost)
- `npm run dev:mobile` - Avvia il server accessibile dalla rete locale (per test su dispositivi mobili)
- `npm run build` - Crea la build di produzione nella cartella `dist`
- `npm run preview` - Anteprima della build di produzione
- `npm run lint` - Esegue il linter ESLint
- `npm run check` - Verifica i tipi TypeScript senza emettere file

## Struttura del Progetto

```
src/
├── components/     # Componenti riutilizzabili
├── pages/         # Pagine dell'applicazione
├── hooks/         # Custom React hooks
├── data/          # Dati statici (quiz, articoli)
├── types/         # Definizioni TypeScript
└── utils/         # Funzioni di utilità
```

## Note

- L'applicazione è completamente client-side e non richiede un backend
- I dati sono memorizzati localmente tramite LocalStorage e IndexedDB
- L'applicazione supporta funzionalità PWA e può essere installata come app mobile

---

## Template Vite + React + TypeScript

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
