import type { BrainStoryStep } from '../types/brain';

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
    overlay: {
      dopamineBar: true,
    },
  },
  {
    id: 4,
    title: 'Il Percorso della Dopamina',
    text: 'La dopamina potenzia la memoria nell\'Ippocampo, fissando i ricordi piacevoli in profondità. L\'Amigdala aggiunge la carica emotiva, mentre la Corteccia Prefrontale — il nostro centro razionale — pianifica nuovi modi per ripetere l\'esperienza gratificante. Con il tempo, questa zona tende a "sopirsi".',
    highlightAreas: ['ippocampo', 'amygdala', 'corteccia'],
    cameraOrbit: '20deg 70deg 2.2m',
    cameraTarget: '0m 0.05m 0m',
    duration: 12,
    overlay: {
      dopamineBar: true,
    },
  },
  {
    id: 5,
    title: 'I Fattori di Rischio',
    text: 'Le cause del Disturbo da Gioco d\'Azzardo (DGA) possono avere origini diverse: una predisposizione genetica alla dipendenza da dopamina, fattori ambientali come amici o familiari che giocano, o lo stress come meccanismo di adattamento per affrontare i problemi.',
    highlightAreas: [],
    cameraOrbit: '0deg 75deg 2.5m',
    cameraTarget: '0m 0.05m 0m',
    duration: 10,
    overlay: {
      icons: ['dna', 'heart', 'house'],
    },
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

// Mapping from area key to possible material names in the GLB
export const AREA_MATERIAL_MAP: Record<string, string[]> = {
  accumbens: ['Mat_Accumbens', 'Mat_accumbens', 'Mat_Accumbens.001'],
  ippocampo: ['Mat_ippocampo', 'Mat_Ippocampo'],
  amygdala: ['Mat_Amygdala', 'Mat_amygdala'],
  corteccia: ['Mat_corteccia', 'Mat_Corteccia'],
  lobi: ['Mat_lobi', 'Mat_lobo_frontale'],
  ciliegie: ['Mat_ciliegia', 'Mat_gambo_ciliegia', 'Mat_ciliege', 'Mat_Ciliege'],
};

export const HIGHLIGHT_COLOR: [number, number, number, number] = [1.0, 0.75, 0.2, 1.0];
export const RED_COLOR: [number, number, number, number] = [0.85, 0.12, 0.12, 1.0];
export const NORMAL_COLOR: [number, number, number, number] = [1.0, 1.0, 1.0, 1.0];
export const HIGHLIGHT_EMISSIVE: [number, number, number] = [0.35, 0.2, 0.0];
export const RED_EMISSIVE: [number, number, number] = [0.4, 0.0, 0.0];
export const NORMAL_EMISSIVE: [number, number, number] = [0.0, 0.0, 0.0];
