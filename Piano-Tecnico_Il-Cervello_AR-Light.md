# Piano Tecnico di Implementazione — "Il Cervello" AR Light

**Progetto:** USA LA TESTA — PWA Gioco Responsabile  
**Feature:** Esperienza AR Light "Il Cervello"  
**Data:** 13 Aprile 2026  
**Stack:** React 18 + TypeScript + Vite + TailwindCSS + Framer Motion

---

## 1. Sintesi Esecutiva

"Il Cervello" è un'esperienza educativa AR Light integrata nella sezione Giochi della PWA "USA LA TESTA". L'utente visualizza un modello 3D interattivo del cervello umano, scoprendo come il sistema di ricompensa e la dopamina influenzano il comportamento durante il gioco d'azzardo. L'esperienza combina un viewer 3D in-browser con la possibilità di proiettare il cervello nel proprio ambiente reale tramite AR (Quick Look su iOS, Scene Viewer su Android).

**Approccio scelto:** `<model-viewer>` di Google come componente web principale, con fallback automatico a Apple Quick Look per iOS e Google Scene Viewer per Android.

---

## 2. Analisi degli Asset Disponibili

### 2.1 Modello 3D — `cervello.glb`

| Proprietà | Valore |
|-----------|--------|
| Formato | glTF Binary (GLB) v2 |
| Dimensione file | 530 KB |
| Polycount totale | 16.682 |
| Meshes | 6 |
| Materiali | 8 |
| Animazioni | 1 (ciliegie, 4s @ 30fps, frame 0-120) |
| Textures embedded | 0 (esterne nel file texture.rar) |

**Struttura nodi e materiali:**

| Nodo | Mesh | Materiale | Area Cerebrale |
|------|------|-----------|----------------|
| `cervelloRoot` | — | — | Root / contenitore |
| `corteccia_g` | Mesh | `Mat_corteccia` | Corteccia prefrontale |
| `ippocampo_g` | Mesh.003 | `Mat_ippocampo` | Ippocampo |
| `accumbens_g` | Mesh.004 | `Mat_Accumbens` | Nucleo Accumbens |
| `amygdala_g` | Mesh.001 | `Mat_Amygdala` | Amigdala |
| `lobi_g` | Mesh.002 | `Mat_lobi` / `Mat_lobo_frontale` | Lobi cerebrali |
| `ciliegie_g` | Mesh.005 | `Mat_ciliegia` / `Mat_gambo_ciliegia` | Elemento decorativo gioco |

**Note sui materiali dei lobi:** `Mat_lobi` e `Mat_lobo_frontale` condividono le stesse texture di normal map e AO (`lobi_Normal_OpenGL` e `Lobi_Mixed_AO`).

### 2.2 Textures — `texture.rar`

Dimensione: 3.2 MB (compresso). Contiene le texture per normal map e ambient occlusion. Queste vanno estratte e integrate (bake) nel file GLB per renderlo self-contained per il web.

### 2.3 File USDZ

**Non presente.** Va generato dal GLB per il supporto AR Quick Look nativo su iOS. Vedi sezione 5.3.

### 2.4 Storytelling e Voiceover

Il documento "Testi e fonti" contiene il voiceover completo e la sequenza narrativa, strutturata in 7 momenti chiave (dallo storyboard):

| Step | Momento Narrativo | Azione 3D | Area Evidenziata |
|------|-------------------|-----------|------------------|
| 1 | Introduzione — il cervello e il sistema di ricompensa | Cervello completo, rotazione lenta | Nessuna (overview) |
| 2 | Il gioco d'azzardo — elementi simbolici | Ciliegie 3D fluttuanti (animazione baked) | `ciliegie_g` animato |
| 3 | La dopamina — il messaggero chimico | Isolamento aree, barra "livello dopamina" | `accumbens_g` highlight |
| 4 | Il percorso della dopamina — corteccia prefrontale | Completamento percorso dopaminergico | `corteccia_g` highlight |
| 5 | I fattori di rischio — genetici, ambientali, stress | Cervello completo, icone overlay (DNA, cuore, casa) | Vista completa |
| 6 | Il cortocircuito — cervello in rosso | Tutto il modello diventa rosso | Tutti i nodi — color shift rosso |
| 7 | La neuroplasticità — guarigione | Ritorno colore normale | Tutti i nodi — color shift normale |

---

## 3. Architettura Tecnica

### 3.1 Dipendenze da Installare

```bash
npm install @google/model-viewer
```

Nessun'altra dipendenza pesante richiesta. `<model-viewer>` è un web component (~180KB gzipped) che include internamente three.js ottimizzato, gestione AR cross-platform e rendering PBR.

**Non servono:** three.js standalone, babylon.js, A-Frame, WebXR polyfills.

### 3.2 Struttura File Proposta

```
src/
├── pages/
│   ├── Games.tsx                          # Modifica: link a BrainExperience
│   └── BrainExperience.tsx                # NUOVA pagina principale
├── components/
│   └── brain/
│       ├── BrainViewer.tsx                # Wrapper <model-viewer>
│       ├── BrainStoryOverlay.tsx          # UI narrativa sovrapposta al viewer
│       ├── BrainStoryStep.tsx             # Singolo step della storia
│       ├── BrainAreaLabel.tsx             # Hotspot/label per area cerebrale
│       ├── DopamineBar.tsx                # Barra livello dopamina
│       └── BrainIntro.tsx                 # Schermata intro prima dell'esperienza
├── data/
│   └── brainStory.ts                      # Dati narrativi e configurazione step
├── hooks/
│   └── useBrainExperience.ts              # Custom hook per stato esperienza
├── types/
│   └── brain.ts                           # TypeScript interfaces
public/
├── models/
│   ├── cervello.glb                       # Modello GLB (con texture baked)
│   └── cervello.usdz                      # Modello USDZ per iOS AR
```

### 3.3 Routing — Modifiche a `App.tsx`

```tsx
// Nuova route SENZA BottomNav (esperienza immersiva fullscreen)
<Route path="/games/cervello" element={<BrainExperience />} />
```

La pagina "Il Cervello" sarà una route fuori dal Layout con BottomNav, per offrire un'esperienza immersiva a schermo intero. Un pulsante "Indietro" personalizzato riporterà a `/games`.

### 3.4 Diagramma Flusso Utente

```
/games
  └── Tap card "Il cervello"
        └── /games/cervello
              ├── BrainIntro (splash + "Inizia esperienza")
              │     └── Tap "Inizia"
              ├── BrainExperience (viewer 3D + narrazione step-by-step)
              │     ├── Step 1-7: scorrimento manuale o auto con audio
              │     ├── [Pulsante AR]: lancia Quick Look / Scene Viewer
              │     └── [Pulsante Chiudi]: torna a /games
              └── Schermata finale (CTA → supporto / quiz / home)
```

---

## 4. Specifiche dei Componenti

### 4.1 `BrainViewer.tsx` — Core 3D Viewer

Wrapper React attorno a `<model-viewer>`. Questo è il cuore tecnico dell'esperienza.

```tsx
// Interfaccia props
interface BrainViewerProps {
  activeAreas: string[];        // nodi da evidenziare
  colorOverride?: string;       // es. '#CC3333' per stato "cortocircuito"
  cameraOrbit?: string;         // es. "45deg 55deg 2.5m"
  cameraTarget?: string;        // es. "0m 0.05m 0m"
  autoRotate?: boolean;
  playAnimation?: boolean;
  showARButton?: boolean;
  onARStatus?: (status: string) => void;
}
```

**Implementazione model-viewer:**

```html
<model-viewer
  src="/models/cervello.glb"
  ios-src="/models/cervello.usdz"
  ar
  ar-modes="webxr scene-viewer quick-look"
  ar-scale="auto"
  camera-controls
  touch-action="pan-y"
  interaction-prompt="none"
  shadow-intensity="0.8"
  environment-image="neutral"
  exposure="1.0"
  camera-orbit="0deg 75deg 2.5m"
  min-camera-orbit="auto auto 1.5m"
  max-camera-orbit="auto auto 4m"
  field-of-view="30deg"
  auto-rotate
  auto-rotate-delay="3000"
  loading="eager"
  poster="/images/cervello-poster.webp"
  alt="Modello 3D interattivo del cervello umano"
>
  <!-- Hotspots per le aree cerebrali -->
  <button slot="hotspot-accumbens"
    data-position="0.01m 0.02m 0.03m"
    data-normal="0 1 0">
    Nucleo Accumbens
  </button>
  <!-- ... altri hotspots -->
  
  <!-- AR button custom -->
  <button slot="ar-button" class="ar-button">
    Visualizza in AR
  </button>
</model-viewer>
```

**Manipolazione materiali via JavaScript API:** Per evidenziare le aree cerebrali, si usa la Material API di model-viewer:

```typescript
const viewer = modelViewerRef.current;
const model = viewer?.model;
if (model) {
  // Evidenzia area specifica cambiando emissive factor
  const material = model.materials.find(m => m.name === 'Mat_Accumbens');
  if (material) {
    material.pbrMetallicRoughness.setBaseColorFactor([1.0, 0.8, 0.2, 1.0]);
    // oppure usa emissiveFactor per "glow"
    material.setEmissiveFactor([0.5, 0.3, 0.0]);
  }
}
```

### 4.2 `BrainStoryOverlay.tsx` — Layer Narrativo

Overlay trasparente sovrapposto al viewer 3D. Gestisce la progressione step-by-step della narrazione.

**Comportamento:**
- Bottom sheet semi-trasparente con testo del voiceover
- Indicatore di progresso (step 1/7)
- Pulsanti Avanti/Indietro
- Animazione con Framer Motion (`AnimatePresence`)
- Ogni cambio di step aggiorna: camera position, aree evidenziate, colori materiali

**Struttura stato (gestito da `useBrainExperience` hook):**

```typescript
interface BrainExperienceState {
  currentStep: number;          // 0-6
  isPlaying: boolean;           // auto-advance con timer
  isARActive: boolean;
  hasCompletedOnce: boolean;    // per sbloccare "esplora liberamente"
}

interface BrainStoryStep {
  id: number;
  title: string;
  text: string;                 // testo voiceover
  highlightAreas: string[];     // nomi nodi da evidenziare
  cameraOrbit: string;          // posizione camera
  cameraTarget: string;         // punto di focus
  colorOverride?: Record<string, [number,number,number,number]>; // override materiali
  playAnimation?: boolean;      // attiva animazione ciliegie
  duration: number;             // secondi per auto-advance
  overlay?: {                   // elementi UI extra
    dopamineBar?: boolean;
    icons?: string[];           // 'dna', 'heart', 'house'
  };
}
```

### 4.3 `DopamineBar.tsx` — Indicatore Visivo

Barra animata che mostra il livello di dopamina, usata negli step 3-4 e 6. Utilizza Framer Motion per l'animazione `width` e cambio colore (verde → giallo → rosso).

### 4.4 `BrainIntro.tsx` — Splash Screen

Schermata introduttiva prima di lanciare l'esperienza 3D. Include titolo, breve descrizione, icona cervello, e CTA "Inizia l'esperienza". Serve anche come buffer per il caricamento del modello 3D in background (preload via `<link rel="preload">`).

### 4.5 `brainStory.ts` — Dati Narrativi

Array di 7 `BrainStoryStep` che mappano il voiceover e lo storyboard sulle proprietà tecniche del viewer. Questo file è il "regista" dell'esperienza e collega testo, camera, materiali e animazioni.

---

## 5. Pipeline degli Asset 3D

### 5.1 Ottimizzazione GLB (Pre-requisito)

Il file GLB attuale (530KB, 16.682 poly) è già leggero. Tuttavia mancano le texture embedded.

**Task:**
1. Estrarre le texture da `texture.rar`
2. In Blender, ri-assegnare le texture ai materiali
3. Ri-esportare come GLB con texture embedded (baked)
4. Verificare che i nomi dei nodi e materiali rimangano invariati
5. Applicare compressione Draco durante l'export (opzione in Blender) per ridurre ulteriormente il file
6. Target: file finale < 2MB con texture

**Comando alternativo (senza Blender):** Se le texture sono semplici, si possono iniettare nel GLB via `gltf-transform`:

```bash
npx gltf-transform merge cervello.glb textures/ cervello-final.glb
npx gltf-transform draco cervello-final.glb cervello-compressed.glb
```

### 5.2 Generazione Poster Image

Creare un'immagine poster (screenshot del cervello da angolazione di default) in formato WebP per il caricamento istantaneo prima che il modello 3D sia pronto:

```bash
npx screenshot-glb --model cervello.glb --output cervello-poster.webp --width 800 --height 600
```

### 5.3 Generazione USDZ per iOS

Il file USDZ è necessario per Apple AR Quick Look. Opzioni di conversione:

**Opzione A — Reality Converter (consigliata, richiede Mac):**
Aprire il GLB in Reality Converter di Apple, verificare materiali e animazioni, esportare come `.usdz`.

**Opzione B — gltf-transform (cross-platform):**
```bash
npx gltf-transform usdz cervello.glb cervello.usdz
```

**Opzione C — Blender (cross-platform):**
File → Export → Universal Scene Description (.usdz)

**Nota importante:** Le animazioni baked (ciliegie) potrebbero non trasferirsi perfettamente in USDZ. Testare su dispositivo iOS reale. Se le animazioni non funzionano in USDZ, il file USDZ può essere statico — l'esperienza AR è comunque valida per la visualizzazione spaziale.

### 5.4 Checklist Qualità Asset

- [ ] GLB con texture embedded, dimensione < 2MB
- [ ] USDZ generato e testato su iPhone/iPad
- [ ] Poster image WebP (800x600, < 50KB)
- [ ] Nomi nodi preservati post-ottimizzazione (verificare con gltf-transform inspect)
- [ ] Animazione ciliegie funzionante nel GLB
- [ ] Test model-viewer locale con tutti gli asset

---

## 6. Configurazione model-viewer nella PWA

### 6.1 Installazione e Setup TypeScript

```bash
npm install @google/model-viewer
```

**Dichiarazione tipi per TypeScript** — creare `src/types/model-viewer.d.ts`:

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        poster?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean;
        'touch-action'?: string;
        'auto-rotate'?: boolean;
        'auto-rotate-delay'?: string;
        'camera-orbit'?: string;
        'camera-target'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'field-of-view'?: string;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        'interaction-prompt'?: 'auto' | 'none';
        'animation-name'?: string;
        autoplay?: boolean;
      },
      HTMLElement
    >;
  }
}
```

### 6.2 Import del Web Component

In `BrainViewer.tsx`:

```typescript
import '@google/model-viewer';
```

Questo registra il custom element `<model-viewer>` globalmente. Va importato una sola volta.

### 6.3 Configurazione Vite

Aggiungere a `vite.config.ts` per evitare warning sui custom elements:

```typescript
plugins: [
  react({
    jsxImportSource: undefined,
  }),
],
// Assicurarsi che i file .glb e .usdz vengano copiati in dist/
assetsInclude: ['**/*.glb', '**/*.usdz'],
```

### 6.4 Service Worker e Caching

Il service worker attuale (`src/sw.js`) usa solo precaching base. Per i modelli 3D, aggiungere import e strategia cache-first:

```javascript
// Aggiungere questi import in cima a src/sw.js
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Cache-first per modelli 3D (cambiano raramente)
registerRoute(
  ({request}) => request.destination === '' && 
    (request.url.endsWith('.glb') || request.url.endsWith('.usdz')),
  new CacheFirst({
    cacheName: '3d-models',
    plugins: [
      new ExpirationPlugin({ maxEntries: 5, maxAgeSeconds: 30 * 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);
```

**Nota:** I pacchetti Workbox necessari (`workbox-routing`, `workbox-strategies`, ecc.) sono già presenti in `node_modules` come dipendenze di `vite-plugin-pwa`.

---

## 7. Strategia AR Cross-Platform

### 7.1 Come Funziona

`<model-viewer>` gestisce automaticamente la compatibilità AR:

| Piattaforma | Modalità AR | File usato | Comportamento |
|-------------|-------------|------------|---------------|
| iOS Safari / PWA | Quick Look | `.usdz` (`ios-src`) | Apre viewer AR nativo Apple |
| Android Chrome | Scene Viewer | `.glb` (`src`) | Apre app AR Google |
| Android (ARCore non disponibile) | — | — | Pulsante AR nascosto |
| Desktop | — | — | Solo viewer 3D, no AR |

L'attributo `ar-modes="webxr scene-viewer quick-look"` definisce l'ordine di priorità.

### 7.2 Best Practices AR per PWA

**Prestazioni:**
- Il modello GLB deve essere < 5MB (il nostro è ~530KB senza texture, ~2MB stimato con texture — ottimo)
- Usare Draco compression per mesh geometry
- Le texture dovranno essere in formato JPEG/WebP embedded, non PNG (risparmio ~40%)
- `loading="eager"` per precaricare il modello durante la schermata intro

**UX:**
- Mostrare il pulsante AR solo se il dispositivo lo supporta (model-viewer lo fa automaticamente)
- Aggiungere un feedback visivo quando l'utente esce dalla modalità AR
- Su iOS, Quick Look si apre come overlay nativo — l'utente torna alla PWA con un tap
- Su Android, Scene Viewer è un'app esterna — gestire il ritorno con `ar-status` event

**Accessibilità:**
- Attributo `alt` descrittivo sul model-viewer
- Testi narrativi sempre visibili come alternativa alla visualizzazione 3D
- `touch-action="pan-y"` per permettere lo scroll della pagina sopra/sotto il viewer
- Fallback immagine statica se WebGL non è supportato (poster)

### 7.3 Limitazioni Note

- **AR offline:** Scene Viewer (Android) e Quick Look (iOS) non funzionano offline. L'AR è disponibile solo con connessione. Il viewer 3D in-browser funziona invece anche offline grazie al service worker.
- **Animazioni in USDZ:** Le animazioni baked potrebbero avere comportamento diverso in Quick Look. Testare separatamente.
- **PWA installata su iOS:** Quick Look funziona anche da PWA installata su Home Screen, ma l'esperienza AR si apre in un layer nativo Apple separato dalla WebView.

---

## 8. Task di Sviluppo e Timeline

### Fase 0 — Preparazione Asset (Prerequisito, non bloccante per il codice)

| # | Task | Owner | Stima | Dipendenza |
|---|------|-------|-------|------------|
| 0.1 | Estrarre texture da RAR | 3D Artist / Dev | 0.5h | — |
| 0.2 | Re-bake texture nel GLB in Blender | 3D Artist | 2h | 0.1 |
| 0.3 | Compressione Draco del GLB | Dev | 0.5h | 0.2 |
| 0.4 | Generare USDZ con Reality Converter | 3D Artist (Mac) | 1h | 0.2 |
| 0.5 | Creare poster image WebP | Dev | 0.5h | 0.2 |
| 0.6 | Verificare nomi nodi e materiali post-export | Dev | 0.5h | 0.3 |

**Subtotale Fase 0:** ~5h

### Fase 1 — Setup Tecnico

| # | Task | Stima | Dipendenza |
|---|------|-------|------------|
| 1.1 | Installare `@google/model-viewer` | 0.5h | — |
| 1.2 | Creare type declarations per model-viewer | 0.5h | 1.1 |
| 1.3 | Configurare Vite per asset 3D | 0.5h | 1.1 |
| 1.4 | Copiare GLB e USDZ in `public/models/` | 0.5h | 0.3, 0.4 |
| 1.5 | Aggiungere route `/games/cervello` in App.tsx | 0.5h | — |

**Subtotale Fase 1:** ~2.5h

### Fase 2 — Core 3D Viewer

| # | Task | Stima | Dipendenza |
|---|------|-------|------------|
| 2.1 | Implementare `BrainViewer.tsx` con model-viewer base | 3h | 1.4 |
| 2.2 | Implementare Material API per highlight aree | 3h | 2.1 |
| 2.3 | Implementare camera orbit presets per ogni step | 2h | 2.1 |
| 2.4 | Implementare hotspots per label aree cerebrali | 2h | 2.1 |
| 2.5 | Test AR su Android (Scene Viewer) | 1h | 2.1 |
| 2.6 | Test AR su iOS (Quick Look) | 1h | 2.1 |

**Subtotale Fase 2:** ~12h

### Fase 3 — UI Narrativa

| # | Task | Stima | Dipendenza |
|---|------|-------|------------|
| 3.1 | Creare `brainStory.ts` con i 7 step narrativi | 2h | — |
| 3.2 | Implementare `BrainIntro.tsx` | 2h | — |
| 3.3 | Implementare `BrainStoryOverlay.tsx` e `BrainStoryStep.tsx` | 4h | 3.1 |
| 3.4 | Implementare `DopamineBar.tsx` | 2h | — |
| 3.5 | Implementare `BrainAreaLabel.tsx` | 1h | — |
| 3.6 | Implementare `useBrainExperience.ts` hook | 3h | 3.1 |
| 3.7 | Collegare overlay ↔ viewer (camera, materiali, animazioni) | 4h | 2.2, 2.3, 3.3, 3.6 |
| 3.8 | Schermata finale con CTA (supporto, quiz, home) | 2h | 3.3 |

**Subtotale Fase 3:** ~20h

### Fase 4 — Integrazione e Polish

| # | Task | Stima | Dipendenza |
|---|------|-------|------------|
| 4.1 | Modificare `Games.tsx` — link attivo alla card "Il cervello" | 1h | 1.5 |
| 4.2 | Aggiornare service worker per cache modelli 3D | 1h | 1.3 |
| 4.3 | Animazioni di transizione con Framer Motion | 3h | 3.7 |
| 4.4 | Responsive design (verificare su vari schermi mobile) | 2h | 3.7 |
| 4.5 | Loading states e skeleton durante caricamento modello | 1h | 2.1 |
| 4.6 | Gestione errori (WebGL non supportato, modello non caricato) | 1h | 2.1 |
| 4.7 | Performance profiling (Lighthouse, memory) | 2h | 4.3 |

**Subtotale Fase 4:** ~11h

### Fase 5 — Testing e QA

| # | Task | Stima | Dipendenza |
|---|------|-------|------------|
| 5.1 | Test funzionale su iPhone (Safari + PWA installata) | 2h | 4.7 |
| 5.2 | Test funzionale su Android (Chrome + PWA installata) | 2h | 4.7 |
| 5.3 | Test offline (viewer 3D senza connessione) | 1h | 4.2 |
| 5.4 | Test accessibilità (screen reader, contrasto testi) | 1h | 4.4 |
| 5.5 | Revisione contenuti narrativi con stakeholder | 2h | 3.7 |
| 5.6 | Bug fixing e polish finale | 4h | 5.1-5.5 |

**Subtotale Fase 5:** ~12h

---

### Riepilogo Effort

| Fase | Ore Stimate |
|------|-------------|
| 0 — Preparazione Asset | 5h |
| 1 — Setup Tecnico | 2.5h |
| 2 — Core 3D Viewer | 12h |
| 3 — UI Narrativa | 20h |
| 4 — Integrazione e Polish | 11h |
| 5 — Testing e QA | 12h |
| **TOTALE** | **~62.5h** |

Con un developer full-time, la stima è di circa **8-10 giorni lavorativi**. Le Fasi 0 e 1 possono procedere in parallelo. La Fase 3 può iniziare parzialmente in parallelo alla Fase 2 (componenti UI indipendenti dal viewer).

---

## 9. Decisioni Architetturali e Trade-off

### 9.1 Perché model-viewer e non Three.js diretto

| Criterio | model-viewer | Three.js diretto |
|----------|-------------|-----------------|
| Tempo di sviluppo | Basso (web component ready) | Alto (tutto da costruire) |
| AR cross-platform | Incluso (Quick Look + Scene Viewer) | Da implementare manualmente |
| Bundle size | ~180KB gzip (ottimizzato) | ~150KB + codice AR custom |
| Manutenzione | Google mantiene il progetto | Responsabilità interna |
| Flessibilità rendering | Media (Material API limitata) | Totale |
| Performance mobile | Ottimizzata (adaptive quality) | Da ottimizzare manualmente |

**Verdetto:** Per un'esperienza educativa con modello relativamente semplice (16K poly), model-viewer offre il miglior rapporto costo/beneficio. La Material API è sufficiente per highlight e cambio colore delle aree.

### 9.2 Evidenziamento Aree — Approccio Tecnico

Tre opzioni valutate:

**A) Cambio baseColorFactor (consigliato):** Modificare il colore base del materiale PBR via Material API. Semplice, performante, compatibile con AR.

**B) Cambio emissiveFactor per "glow":** Aggiungere emissione per un effetto luminoso. Più scenografico, ma non si riflette in AR (Quick Look/Scene Viewer usano il modello originale).

**C) Swap di modello GLB per ogni step:** Preparare 7 varianti del GLB con colori pre-applicati. Massimo controllo visivo, ma 7x peso in download e complessità di gestione.

**Decisione:** Approccio A per la versione in-browser, con emissive factor (B) come enhancement opzionale. In AR il modello appare sempre nello stato base (limitazione di Quick Look/Scene Viewer).

### 9.3 Audio/Voiceover

Lo storyboard prevede un voiceover audio. Due opzioni:

**A) Testo scritto (MVP):** I testi del voiceover vengono mostrati come testo nell'overlay. Nessuna complessità audio.

**B) Audio narrato (fase successiva):** File audio MP3 sincronizzati con gli step. Richiede registrazione professionale, player audio, controlli play/pause, e sincronizzazione con i cambi di step.

**Raccomandazione:** Iniziare con A (testo), pianificare B come enhancement successivo. L'architettura del hook `useBrainExperience` supporterà entrambi i casi.

---

## 10. Rischi e Mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Texture non si integrano correttamente nel GLB | Media | Alto | Test immediato in Fase 0, fallback con materiali solid color |
| USDZ non preserva animazioni | Alta | Basso | USDZ statico è accettabile, esperienza AR comunque valida |
| Material API non sufficiente per highlight voluto | Bassa | Medio | Fallback ad approccio multi-GLB (9.2 opzione C) |
| Performance scadente su device low-end | Bassa | Medio | Polycount già basso (16K), model-viewer ha adaptive quality |
| Quick Look non funziona da PWA installata | Bassa | Medio | Testare early, fallback a solo viewer 3D in-browser |
| Utente non capisce come interagire col 3D | Media | Medio | Interaction prompt, tutorial gesture iniziale |

---

## 11. Metriche di Successo

Per valutare l'efficacia dell'esperienza, tracciare (via analytics esistenti o futuri):

- Percentuale di utenti che aprono "Il Cervello" dalla pagina Giochi
- Percentuale di completamento dei 7 step narrativi
- Percentuale di utenti che attivano la modalità AR
- Tempo medio di permanenza nell'esperienza
- Tasso di click sulla CTA finale (supporto, quiz)

---

## 12. Reference e Risorse

**Documentazione tecnica:**
- model-viewer: https://modelviewer.dev/
- model-viewer Material API: https://modelviewer.dev/docs/index.html#entrydocs-scenegraph
- Apple Quick Look: https://developer.apple.com/augmented-reality/quick-look/
- Google Scene Viewer: https://developers.google.com/ar/develop/scene-viewer

**Contenuto scientifico (dal documento "Testi e fonti"):**
- BrainFacts 3D Brain: https://www.brainfacts.org/3d-brain
- Sistema motivazionale: https://www.brainfacts.org/~/link.aspx?_id=029407C12A8F4E90A24752E2B65B09A8
- Video "La trappola della dopamina": https://www.youtube.com/watch?v=Vli5pvCrNcM

**Fornitori asset:**
- Modello 3D e storyboard: Keiron Interactive (francesco.iaia@keiron.fit)
