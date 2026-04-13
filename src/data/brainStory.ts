import type { BrainStoryStep } from '../types/brain';

// ─── Area types ──────────────────────────────────────────────────────────────

export type AreaKey = 'accumbens' | 'ippocampo' | 'amygdala' | 'corteccia' | 'lobi' | 'ciliegie';

export interface AreaConfig {
  /**
   * Material names to match (lowercase, case-insensitive comparison).
   * Each entry maps to exactly ONE material in the GLB — this is the mechanism
   * that lets us select a single material from a mesh with multiple materials
   * (e.g. lobi_g has Mat_lobi AND Mat_lobo_frontale as separate primitives).
   */
  materials: string[];
  /**
   * Emissive glow [R, G, B] in linear light space (0–1).
   * Palette USA LA TESTA: #0B2A57 · #9D2050 · #4195A4
   */
  emissive: [number, number, number];
  /**
   * Optional baseColorFactor override [R, G, B, A].
   * When omitted, the original base colour is preserved and only
   * the emissive channel is modified — useful for textured materials.
   */
  baseColor?: [number, number, number, number];
}

// ─── Per-area config with palette colours ─────────────────────────────────────
//
// Mesh → material reference from documento_cervello.pdf:
//   ciliege_g      → Mat_ciliege
//   corteccia_g    → Mat_corteccia
//   ippocampo_g    → Mat_ippocampo
//   accumbens_g    → Mat_accumbens
//   amygdala_g     → Mat_amygdala
//   lobi_g         → Mat_lobi  ·  Mat_lobo_frontale  ← TWO materials, one mesh
//
// The two-material mesh case is handled naturally: we store each material name
// individually in its own AreaConfig. When the viewer iterates model.materials
// it finds each by name and applies the correct treatment independently.

export const AREA_CONFIG: Record<AreaKey, AreaConfig> = {
  // Nucleo Accumbens — reward / dopamine centre
  // Palette: teal #4195A4 → linear [0.255, 0.584, 0.643] — brighter for emissive
  accumbens: {
    materials: ['mat_accumbens'],
    emissive: [0.25, 0.65, 0.76],
  },

  // Ippocampo — memory consolidation
  // Warm amber — distinguishable from teal and blue
  ippocampo: {
    materials: ['mat_ippocampo'],
    emissive: [0.78, 0.44, 0.04],
  },

  // Amigdala — emotional processing
  // Palette: pink #9D2050 → linear [0.616, 0.125, 0.314] — boosted for visibility
  amygdala: {
    materials: ['mat_amygdala'],
    emissive: [0.72, 0.10, 0.32],
  },

  // Corteccia Prefrontale — rational decision-making
  // Highlights Mat_corteccia (cortex surface) AND Mat_lobo_frontale (frontal lobe).
  // IMPORTANT: Mat_lobi shares the same lobi_g mesh as Mat_lobo_frontale but is
  // NOT included here — it will be treated as a non-highlighted material and dimmed.
  // Palette: primary blue #0B2A57 → linear [0.043, 0.165, 0.341] — boosted
  corteccia: {
    materials: ['mat_corteccia', 'mat_lobo_frontale'],
    emissive: [0.05, 0.20, 0.80],
  },

  // Lobi generali (all lobes except frontal)
  // Uses Mat_lobi only — deliberately excludes Mat_lobo_frontale which belongs
  // to the `corteccia` area on the same lobi_g mesh.
  lobi: {
    materials: ['mat_lobi'],
    emissive: [0.18, 0.40, 0.62],
  },

  // Ciliegie — gambling symbol / aspettativa
  // Gold — evokes slot machine imagery
  ciliegie: {
    materials: ['mat_ciliegia', 'mat_gambo_ciliegia', 'mat_ciliege'],
    emissive: [0.82, 0.58, 0.0],
    baseColor: [1.0, 0.92, 0.4, 1.0],
  },
};

// Pre-built reverse map: lowercase material name → AreaKey
// Used by BrainViewer to look up which config to apply per material.
export const MATERIAL_TO_AREA: ReadonlyMap<string, AreaKey> = new Map(
  (Object.entries(AREA_CONFIG) as [AreaKey, AreaConfig][]).flatMap(
    ([key, cfg]) => cfg.materials.map((m) => [m, key] as [string, AreaKey])
  )
);

// ─── Step-level colour constants ──────────────────────────────────────────────

/** Step 6 — cortocircuito: the entire brain turns red */
export const RED_BASE: [number, number, number, number] = [0.85, 0.08, 0.08, 1.0];
export const RED_EMISSIVE: [number, number, number] = [0.60, 0.0, 0.0];

/**
 * Alpha applied to non-highlighted materials when a step has active highlights.
 * The material's own RGB is preserved so the texture remains readable; only
 * the alpha channel is collapsed to create an X-ray / ghost effect.
 * Range 0–1. Lower = more transparent.
 */
export const DIM_ALPHA = 0.10;

// ─── Story steps ─────────────────────────────────────────────────────────────

export const BRAIN_STEPS: BrainStoryStep[] = [
  {
    id: 1,
    title: 'Il Sistema di Ricompensa',
    text: 'Il tuo cervello è la macchina più complessa dell\'universo. Due cose guidano le azioni umane: le necessità e le ricompense. I circuiti cerebrali noti come "sistema di ricompensa" regolano come valutiamo e reagiamo a questi stimoli — e sono al cuore di tutto ciò che accade quando giochiamo.',
    highlightAreas: [],
    cameraOrbit: '0deg 75deg 2.5m',
    cameraTarget: '0m 0.05m 0m',
    duration: 9,
  },
  {
    id: 2,
    title: 'Il Gioco e l\'Aspettativa',
    text: 'Ogni volta che anticipiamo una vincita, il cervello si attiva prima ancora di ottenerla. Non è la ricompensa in sé, ma l\'aspettativa di riceverla a creare la sensazione più potente. Il simbolo del gioco d\'azzardo si radica così nel nostro sistema nervoso.',
    highlightAreas: ['ciliegie'],
    cameraOrbit: '30deg 80deg 2m',
    cameraTarget: '0m 0.02m 0m',
    playAnimation: true,
    duration: 8,
  },
  {
    id: 3,
    title: 'La Dopamina — il Messaggero',
    text: 'Il processo parte dall\'area tegmentale ventrale e arriva al Nucleo Accumbens — il centro del piacere. Qui viene rilasciata la dopamina, il principale mezzo di comunicazione che gestisce il piacere e ci spinge all\'azione. Si attiva già nel momento in cui prevediamo di ottenere un premio.',
    highlightAreas: ['accumbens'],
    cameraOrbit: '0deg 90deg 1.8m',
    cameraTarget: '0m -0.02m 0m',
    duration: 10,
    overlay: { dopamineBar: true },
  },
  {
    id: 4,
    title: 'Il Percorso della Dopamina',
    text: 'La dopamina potenzia la memoria nell\'Ippocampo, fissando i ricordi piacevoli in profondità. L\'Amigdala aggiunge la carica emotiva, mentre la Corteccia Prefrontale — il nostro centro razionale — pianifica nuovi modi per ripetere l\'esperienza gratificante. Con il tempo, questa zona tende a "sopirsi".',
    highlightAreas: ['ippocampo', 'amygdala', 'corteccia'],
    cameraOrbit: '20deg 70deg 2.2m',
    cameraTarget: '0m 0.05m 0m',
    duration: 12,
    overlay: { dopamineBar: true },
  },
  {
    id: 5,
    title: 'I Fattori di Rischio',
    text: 'Le cause del Disturbo da Gioco d\'Azzardo (DGA) possono avere origini diverse: una predisposizione genetica alla dipendenza da dopamina, fattori ambientali come amici o familiari che giocano, o lo stress come meccanismo di adattamento per affrontare i problemi.',
    highlightAreas: [],
    cameraOrbit: '0deg 75deg 2.5m',
    cameraTarget: '0m 0.05m 0m',
    duration: 10,
    overlay: { icons: ['dna', 'heart', 'house'] },
  },
  {
    id: 6,
    title: 'Il Cortocircuito',
    text: 'Il gioco con vincita in denaro crea un cortocircuito nel cervello. Il fenomeno del "Near-Miss" o "Quasi Vincita": quando ci si avvicina a una vincita senza ottenerla, il cervello rilascia quasi la stessa dopamina di una vittoria reale. Questo ti convince erroneamente che la prossima vincita sia vicina. Ma non si può influenzare il caso!',
    highlightAreas: [],
    allRed: true,
    cameraOrbit: '0deg 75deg 2.5m',
    cameraTarget: '0m 0.05m 0m',
    duration: 12,
  },
  {
    id: 7,
    title: 'La Neuroplasticità — Puoi Guarire',
    text: 'Le dinamiche del disturbo possono essere interrotte. Il nostro cervello è una macchina straordinaria che può rimodellarsi! Grazie alla neuroplasticità, il cervello può guarire. Il primo passo è riconoscere di avere un problema e chiedere aiuto ai professionisti.',
    highlightAreas: [],
    allRed: false,
    cameraOrbit: '0deg 75deg 2.5m',
    cameraTarget: '0m 0.05m 0m',
    duration: 8,
  },
];
