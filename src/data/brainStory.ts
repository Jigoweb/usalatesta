import type { BrainStoryStep } from '../types/brain';

// ─── Area types ──────────────────────────────────────────────────────────────

export type AreaKey =
  | 'accumbens'
  | 'ippocampo'
  | 'amygdala'
  | 'corteccia'
  | 'corteccia_inattiva'
  | 'lobi'
  | 'ciliegie'
  | 'saette';

export interface AreaConfig {
  /**
   * Material names to match — stored lowercase for case-insensitive comparison.
   * Each entry targets exactly ONE material in the GLB, which is how we handle
   * meshes with multiple materials (e.g. lobi_g has Mat_lobi AND Mat_lobo_frontale).
   */
  materials: string[];
  /**
   * Neutral materials: included in the highlight set (so they are NOT ghosted)
   * but rendered at their snapshot colour with no emissive glow.
   * Use for materials that share a mesh with a highlighted material but should
   * remain at brain-pink baseline (e.g. mat_lobi when corteccia is active).
   */
  neutralMaterials?: string[];
  /** Emissive glow [R,G,B] linear (0–1). Palette: #0B2A57 · #9D2050 · #4195A4 */
  emissive: [number, number, number];
  /** Optional base-colour override [R,G,B,A] linear. Applies to ALL materials in this area. */
  baseColor?: [number, number, number, number];
  /** Per-material base-colour overrides — takes precedence over baseColor. */
  materialColors?: Record<string, [number, number, number, number]>;
}

// ─── Per-area configs with palette colours ───────────────────────────────────
//
// GLB mesh → material reference (documento_cervello.pdf):
//   ciliege_g   → Mat_ciliege
//   corteccia_g → Mat_corteccia
//   ippocampo_g → Mat_ippocampo
//   accumbens_g → Mat_accumbens
//   amygdala_g  → Mat_amygdala
//   lobi_g      → Mat_lobi  ·  Mat_lobo_frontale  ← 2 materials, 1 mesh
//   saette_g    → Mat_saetta  ← new: near-miss / cortocircuito lightning

export const AREA_CONFIG: Record<AreaKey, AreaConfig> = {
  // Nucleo Accumbens — teal #4195A4 (dopamine / reward)
  accumbens: {
    materials: ['mat_accumbens'],
    emissive: [0.25, 0.65, 0.76],
  },
  // Ippocampo — warm amber (memory)
  ippocampo: {
    materials: ['mat_ippocampo'],
    emissive: [0.78, 0.44, 0.04],
  },
  // Amigdala — pink #9D2050 (emotion / alarm)
  amygdala: {
    materials: ['mat_amygdala'],
    emissive: [0.72, 0.10, 0.32],
  },
  // Corteccia Prefrontale — blue #0B2A57 (rational decision)
  // Targets Mat_corteccia AND Mat_lobo_frontale from lobi_g.
  // Mat_lobi shares the same mesh as Mat_lobo_frontale; it is listed as
  // neutralMaterial so it is NOT ghosted but stays at brain-pink with no emissive.
  corteccia: {
    materials: ['mat_corteccia', 'mat_lobo_frontale'],
    neutralMaterials: ['mat_lobi'],
    emissive: [0.05, 0.20, 0.80],
  },
  // Corteccia Prefrontale (Assopita) — light blue/grey
  // Used in step 6 to show it's inactive/less active while other areas are active.
  corteccia_inattiva: {
    materials: ['mat_lobo_frontale'], 
    neutralMaterials: ['mat_corteccia', 'mat_lobi'],
    emissive: [0.0, 0.15, 0.35],
    materialColors: {
      'mat_lobo_frontale': [0.1, 0.3, 0.6, 1.0],
    }
  },
  // Lobi generali — excludes Mat_lobo_frontale (corteccia area)
  lobi: {
    materials: ['mat_lobi'],
    emissive: [0.18, 0.40, 0.62],
  },
  // Ciliegie — red cherries (gambling symbol)
  // CONDITIONAL: visible ONLY in step 2, hidden (alpha=0, BLEND) in all other steps.
  ciliegie: {
    materials: ['mat_ciliegia', 'mat_gambo_ciliegia', 'mat_ciliege', 'mat_ciliegie'],
    emissive: [0.6, 0.0, 0.0],
    baseColor: [1.0, 0.0, 0.0, 1.0],
    materialColors: {
      // Stem (gambo) — dark woody brown (wood color) + no emissive (to prevent it from glowing red)
      'mat_gambo_ciliegia': [0.25, 0.12, 0.05, 1.0],
    },
  },
  // Saette — yellow lightning (cortocircuito)
  // CONDITIONAL: visible ONLY in step 7, hidden (alpha=0, MASK) in all other steps.
  saette: {
    materials: ['mat_saette'],
    emissive: [1.0, 0.78, 0.0],
    baseColor: [1.0, 0.92, 0.2, 1.0],
  },
};

// Pre-built reverse map: lowercase material name → AreaKey
export const MATERIAL_TO_AREA: ReadonlyMap<string, AreaKey> = new Map(
  (Object.entries(AREA_CONFIG) as [AreaKey, AreaConfig][]).flatMap(
    ([key, cfg]) => cfg.materials.map((m) => [m, key] as [string, AreaKey])
  )
);

// ─── Conditional visibility ───────────────────────────────────────────────────
// Materials in these areas are ALWAYS alpha-0 (invisible) except in the listed step IDs.

export const CONDITIONAL_AREAS: Partial<Record<AreaKey, readonly number[]>> = {
  ciliegie: [2],  // ciliegie visible only in step 2
  saette:   [7],  // saette visible only in step 7 (cortocircuito)
};

// Reverse map for fast lookup: material name → conditional area key
export const MATERIAL_TO_CONDITIONAL: ReadonlyMap<string, AreaKey> = new Map(
  (Object.entries(CONDITIONAL_AREAS) as [AreaKey, readonly number[]][]).flatMap(
    ([key]) => AREA_CONFIG[key].materials.map((m) => [m, key] as [string, AreaKey])
  )
);

// ─── Colour constants ─────────────────────────────────────────────────────────

/**
 * Default brain tissue colour — light pink as a real brain, applied to all
 * non-conditional materials on load (before snapshot is captured).
 * sRGB ≈ #F0BCAF → linear space approximation.
 */
export const BRAIN_PINK: [number, number, number, number] = [0.90, 0.52, 0.44, 1.0];

/** Step 7 — cortocircuito: entire brain turns red */
export const RED_BASE: [number, number, number, number] = [0.85, 0.08, 0.08, 1.0];
export const RED_EMISSIVE: [number, number, number] = [0.60, 0.0, 0.0];

/** Alpha for non-highlighted brain tissue when a step has active highlights */
export const DIM_ALPHA = 0.10;

/** Layout constants */
export const BRAIN_LAYOUT = {
  /** Height reserved at the bottom of the screen for the narrative panel */
  panelHeight: 'max(260px, 32vh)',
};

// ─── 10 story steps ──────────────────────────────────────────────────────────

export const BRAIN_STEPS: BrainStoryStep[] = [
  // ── 1 ────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'Come funziona il tuo cervello',
    text: 'Il tuo cervello è la macchina più complessa dell\'universo. Due cose guidano le azioni umane: le necessità (cibo, sonno, evitare il dolore) e le ricompense. Qualsiasi oggetto, evento o attività può essere una ricompensa se ci motiva, ci fa imparare o suscita sensazioni piacevoli. Ma come fa il nostro cervello a calcolare il valore di una ricompensa e come viene tradotto in azione? La risposta sta nei circuiti cerebrali noti come "sistema di ricompensa".',
    highlightAreas: [],
    cameraOrbit: '0deg 75deg 1.6m',
    cameraTarget: '0m 0.0m 0m',
    duration: 31,
    audioUrl: '/audio/1-come funziona il tuo cervello.mp3',
  },

  // ── 2 ────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'Il gioco e la dopamina',
    text: 'Ogni volta che anticipiamo una vincita o un successo, il nostro cervello rilascia dopamina. La dopamina è il principale mezzo di comunicazione tra le diverse aree del cervello che gestiscono il piacere.',
    highlightAreas: ['ciliegie'],
    animationName: 'Action',
    cameraOrbit: '20deg 70deg 1.45m',
    cameraTarget: '0m 0.04m 0m',
    duration: 13,
    audioUrl: '/audio/2-il gioco e la dopamina.mp3',
    overlay: { dopamineLevel: 'bassa' },
  },

  // ── 3 ────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "L'inizio del processo",
    text: "Il processo parte dall'area tegmentale ventrale e arriva al nucleo accumbens, con l'obiettivo di elaborare la sensazione di ricompensa e spingerci all'azione. La cosa interessante è che questi messaggeri chimici si attivano già nel momento in cui prevediamo di ottenere un premio, creando una forte aspettativa.",
    highlightAreas: ['accumbens'],
    cameraOrbit: '0deg 88deg 1.1m',
    cameraTarget: '0m -0.06m 0m',
    duration: 18,
    audioUrl: "/audio/3-l'inizio del processo.mp3",
  },

  // ── 4 ────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    title: "L'ippocampo",
    text: "Oltre a generare motivazione, la dopamina agisce come un potenziatore della memoria e delle connessioni tra i neuroni all'interno dell'ippocampo, fissando i ricordi piacevoli in modo molto profondo.",
    highlightAreas: ['ippocampo'],
    cameraOrbit: '-15deg 95deg 1.1m',
    cameraTarget: '0m -0.08m 0m',
    duration: 11,
    audioUrl: "/audio/4-l'iippocampo.mp3",
  },

  // ── 5 ────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Il ruolo dell'amigdala",
    text: "Contemporaneamente, coinvolge l'amigdala e la corteccia prefrontale per aggiungere una carica emotiva a queste esperienze e spingere la nostra mente a pianificare nuovi modi per ripetere quel comportamento gratificante.",
    highlightAreas: ['amygdala'],
    cameraOrbit: '42deg 82deg 1.2m',
    cameraTarget: '0m -0.06m 0m',
    duration: 12,
    audioUrl: "/audio/5-il ruolo dell'Amigdala.mp3",
  },

  // ── 6 ────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "L'aspettativa di vincita",
    text: "Quando si gioca a livello celebrale si attivano dunque, attraverso la dopamina, diverse aree del cervello che creano emozioni, piacere e ricordi molto forti. Non è la ricompensa in sé, ma l'aspettativa di una ricompensa che influenza in modo più potente le reazioni emotive e i ricordi. Il giocatore assocerà il rilascio della dopamina e questa sensazione piacevole e vorrà ripetere l'esperienza per gratificarsi. La parte della corteccia prefrontale — la parte razionale del nostro cervello — tende a sopirsi pur di vivere questa scarica piacevole di dopamina.",
    highlightAreas: ['accumbens', 'corteccia_inattiva'],
    cameraOrbit: '10deg 75deg 1.5m',
    cameraTarget: '0m -0.02m 0m',
    duration: 34,
    audioUrl: "/audio/6-l'aspettativa di vincita.mp3",
    overlay: { dopamineLevel: 'media' },
  },

  // ── 7 ────────────────────────────────────────────────────────────────────────
  {
    id: 7,
    title: 'Il cortocircuito',
    text: 'Tuttavia, nel tempo il cervello si adatta a questa costante stimolazione del sistema di ricompensa diventando sempre meno sensibile alla dopamina. Questo vuol dire che una persona che soffre di DGA — cioè Disturbo da Gioco d\'Azzardo — potrà sentire il bisogno di giocare sempre di più e con importi sempre più elevati per avere la stessa sensazione data dalla dopamina.',
    highlightAreas: ['saette'],
    animationName: 'saette_g|Take 001|BaseLayer',
    allRed: true,
    cameraOrbit: '0deg 75deg 1.6m',
    cameraTarget: '0m 0.0m 0m',
    duration: 21,
    audioUrl: "/audio/7-il cortocircuito.mp3",
    overlay: { dopamineLevel: 'alta' },
  },

  // ── 8 ────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    title: "La psicologia dell'errore",
    text: 'Il gioco con vincita in denaro spesso crea un corto-circuito che è a tutti gli effetti un bug del nostro cervello. Parliamo del cosiddetto fenomeno del "Near-Miss" o "Quasi Vincita". Quando ci si avvicina ad una vincita, senza ottenerla, il cervello rilascia quasi la stessa dopamina di una vittoria reale. Questo ti convince erroneamente che il successo, la prossima vincita, sia vicina, spingendoti a giocare ancora. Invece, non si può influenzare il caso! Ricordalo sempre.',
    highlightAreas: [],
    cameraOrbit: '15deg 68deg 1.45m',
    cameraTarget: '0m 0.04m 0m',
    duration: 32,
    audioUrl: "/audio/8-la psicologia dell'errore.mp3",
  },

  // ── 9 ────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: 'Le cause scientifiche del DGA',
    text: 'Le cause del DGA possono avere diverse origini: in alcuni casi si può avere una predisposizione genetica alla dipendenza da dopamina, mentre in altri il disturbo può svilupparsi a causa di fattori ambientali (ad esempio per via di amici o famigliari che giocano) o come meccanismo di adattamento per affrontare stress e problemi.',
    highlightAreas: [],
    cameraOrbit: '-10deg 72deg 1.7m',
    cameraTarget: '0m 0.0m 0m',
    duration: 20,
    audioUrl: "/audio/9-le cause scientifiche del DGA.mp3",
    overlay: { icons: ['dna', 'house', 'heart'] },
  },

  // ── 10 ───────────────────────────────────────────────────────────────────────
  {
    id: 10,
    title: 'Una macchina straordinaria: la neuroplasticità',
    text: 'Le dinamiche connesse al disturbo però possono essere interrotte. Il nostro cervello è una macchina straordinaria, che si può rimodellare! Infatti, la buona notizia è che, grazie alla neuroplasticità, il cervello può guarire. Ma il primo passo è riconoscere di avere un problema e chiedere aiuto ai professionisti.',
    highlightAreas: [],
    allRed: false,
    cameraOrbit: '0deg 75deg 1.6m',
    cameraTarget: '0m 0.0m 0m',
    duration: 22,
    audioUrl: "/audio/10-una-macchina-straordinaria.mp3",
  }
];
