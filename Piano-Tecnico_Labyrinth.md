# Piano Tecnico di Implementazione — "Labyrinth: Quanto Tempo è Passato?"

**Progetto:** USA LA TESTA — PWA Gioco Responsabile
**Feature:** Esperienza Interattiva "Labyrinth" (Percezione del Tempo)
**Data:** 28 Aprile 2026
**Stack:** React 18 + TypeScript + Tailwind CSS + Framer Motion + `generate-maze`

---

## 1. Obiettivo dell'Esperienza

"Labyrinth" è un mini-gioco interattivo (PWA) progettato per dimostrare tangibilmente come un'attività altamente immersiva possa distorcere la percezione del tempo. 
L'utente dovrà guidare una sfera in un labirinto 2D (generato proceduralmente) inclinando fisicamente lo smartphone (Giroscopio). Al termine del livello, prima di mostrare il tempo effettivo impiegato, verrà richiesto all'utente di **stimare** il tempo trascorso. Il confronto tra tempo reale e percepito fungerà da parallelismo educativo con le sessioni di gioco d'azzardo.

---

## 2. Architettura Tecnica e Librerie

### 2.1 Stack e Dipendenze
- **Generazione Labirinto:** `generate-maze` (algoritmo Recursive Backtracking per labirinti perfetti e sempre risolvibili).
- **Fisica e Movimento:** Implementazione custom o `matter.js` (per gestire inerzia, attrito e rimbalzi della sfera sui muri in base ai dati del giroscopio).
- **Sensori Device:** `DeviceOrientationEvent` nativo del browser.
- **Animazioni UI:** `framer-motion`.

### 2.2 Struttura File
```text
src/
├── pages/
│   └── LabyrinthExperience.tsx            # Container di pagina (gestisce il flusso di stato)
├── components/
│   └── labyrinth/
│       ├── LabyrinthIntro.tsx             # Splash page iniziale (richiede permessi iOS)
│       ├── LabyrinthGame.tsx              # Motore di gioco (Render labirinto, Pallina, Sensori)
│       ├── LabyrinthResult.tsx            # Modale input stima tempo e Grafico di confronto
│       └── DecaloguePopup.tsx             # Distrattore cognitivo a fine livello
├── hooks/
│   └── useLabyrinthGame.ts                # Hook per logica fisica, collisioni e timer reale
└── types/
    └── labyrinth.ts                       # Interfacce (Cell, Maze, GameState)
```

---

## 3. Gestione Sensori (Giroscopio) e Sicurezza

Il gioco si basa sull'inclinazione del device. Questo richiede l'accesso a `DeviceOrientationEvent`.

### 3.1 Ostacoli Tecnici e Soluzioni
1. **Requisito HTTPS:** Essendo una PWA moderna, l'ambiente di produzione è già sotto HTTPS (requisito fondamentale per le API dei sensori).
2. **iOS 13+ Permission Wall:** Apple richiede un'interazione esplicita dell'utente (click) per sbloccare l'accesso al giroscopio.
   - **Implementazione:** Il pulsante "Inizia l'esperienza" in `LabyrinthIntro.tsx` non si limiterà a cambiare pagina, ma invocherà `DeviceOrientationEvent.requestPermission()`. Solo alla ricezione del permesso (`granted`) il gioco verrà avviato.
3. **Fallback per Desktop:** Se il device non ha un giroscopio (es. PC) o i permessi vengono negati, verrà implementato un sistema di controllo fallback basato su trascinamento (Mouse/Touch Drag) o frecce direzionali.

---

## 4. Flusso dell'Esperienza (State Machine)

Il container `LabyrinthExperience.tsx` gestirà una macchina a stati rigida per preservare l'integrità dell'esperimento psicologico:

1. **`PHASE: INTRO`**
   - Schermata di benvenuto, spiegazione regole e richiesta permessi.
2. **`PHASE: PLAYING`**
   - Labirinto generato. Pallina mossa dal device.
   - **CRITICITÀ:** Nessun timer, orologio o barra di progresso deve essere visibile a schermo.
   - Un timer invisibile (`performance.now()`) parte al primo input di movimento.
   - Feedback aptico (`navigator.vibrate(10)`) ai lievi urti contro i muri per aumentare l'immersività.
3. **`PHASE: FINISHED`**
   - La sfera tocca il traguardo. Il timer invisibile si ferma e il valore viene salvato in stato (`actualTime`).
4. **`PHASE: DISTRACTION`**
   - Appare il `DecaloguePopup.tsx` con un consiglio sul gioco responsabile. L'utente deve leggerlo e chiuderlo. Questo resetta la memoria a breve termine.
5. **`PHASE: ESTIMATION`**
   - Viene chiesto: *"Quanto tempo pensi di aver impiegato?"*.
   - Input UI: Slider o Numpad (in Secondi/Minuti). Il valore viene salvato in `estimatedTime`.
6. **`PHASE: REVEAL`**
   - Confronto grafico (Barre affiancate) tra `estimatedTime` e `actualTime`.
   - Messaggio dinamico contestuale (es. *"Hai sottostimato il tempo del 30%. Quando sei concentrato perdi la cognizione del tempo, proprio come accade nel DGA."*).

---

## 5. Meccanica di Gioco (Core Loop)

### 5.1 Generazione Labirinto
- All'avvio di `LabyrinthGame`, la libreria `generate-maze` creerà una matrice 2D (es. 10x15 celle).
- La matrice verrà renderizzata tramite CSS Grid, disegnando i bordi (`border-top`, `border-right`, ecc.) in base ai dati della cella.

### 5.2 Loop Fisico (Game Loop)
- Un `requestAnimationFrame` loop leggerà continuamente i valori `event.gamma` (inclinazione X) e `event.beta` (inclinazione Y).
- Questi valori verranno convertiti in vettori di velocità applicati alla coordinata `(x,y)` della sfera.
- **Collision Detection (AABB):** Prima di applicare la nuova posizione, il sistema calcolerà se la sfera (raggio R) interseca uno dei muri della cella corrente. In caso positivo, la velocità su quell'asse verrà azzerata (o invertita per un effetto rimbalzo).

---

## 6. Task di Implementazione (Roadmap)

1. **Setup Iniziale:** Installazione `generate-maze` e setup dei tipi TypeScript (`types/labyrinth.ts`).
2. **Scaffolding UI:** Creazione di `LabyrinthExperience.tsx` e aggiornamento router in `App.tsx` e `Games.tsx`.
3. **Splash Page & Permessi:** Creazione di `LabyrinthIntro` con logica di sblocco `DeviceOrientationEvent` per iOS.
4. **Motore di Gioco (Render):** Implementazione della griglia del labirinto e posizionamento CSS della sfera.
5. **Motore di Gioco (Fisica):** Hook `useLabyrinthGame` per mappare l'inclinazione in movimento e gestire le collisioni con i muri.
6. **Time Tracking & UX:** Implementazione delle fasi di distrazione, stima temporale e grafico finale di confronto.
7. **Polish:** Vibrazioni aptiche, transizioni Framer Motion, e test su device fisici (iOS/Android).

---

## 7. Criteri di Accettazione

- [ ] Il labirinto è sempre diverso a ogni partita e sempre risolvibile.
- [ ] La sfera si muove fluidamente inclinando lo smartphone, senza attraversare i muri.
- [ ] L'esperienza chiede i permessi giroscopio su iPhone in modo nativo e funzionante.
- [ ] Nessun timer è visibile durante il gameplay.
- [ ] Il flusso finale (Traguardo -> Distrazione -> Stima -> Reveal) non è aggirabile.