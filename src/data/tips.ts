import { Tip } from '../types';

// Colori solidi dalla palette (senza opacità)
const COLORS = {
  primaryBlue: '#0B2A57',
  primaryLightblue: '#65ADDE',
  primaryGray: '#9EA4AD',
  secondaryOrange: '#DA642C',
  secondaryBordeaux: '#9D2050',
  tertiaryOchre: '#ECAA45',
  tertiaryPetrol: '#4195A4',
  tertiaryGreen: '#6AAB46',
  tertiaryPurple: '#7A7FAD',
};

// Funzione helper per creare gradienti con forme organiche (blob-like)
const createOrganicGradient = (
  accentColor: string,
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right'
) => {
  // Base blue color
  const baseBlue = '#0B2A57';
  
  // Configurazioni per i "satelliti": oltre al blob principale nell'angolo,
  // ne aggiungiamo altri due leggermente spostati per rompere la simmetria circolare
  // e creare un effetto "nuvola" più irregolare (freeform).
  const configs = {
    'top-right': {
      main: 'at 100% 0%',
      sat1: 'at 65% 10%',  // Allungamento verso sinistra
      sat2: 'at 90% 40%',  // Allungamento verso il basso
    },
    'top-left': {
      main: 'at 0% 0%',
      sat1: 'at 35% 10%',
      sat2: 'at 10% 40%',
    },
    'bottom-right': {
      main: 'at 100% 100%',
      sat1: 'at 65% 90%',
      sat2: 'at 90% 60%',
    },
    'bottom-left': {
      main: 'at 0% 100%',
      sat1: 'at 35% 90%',
      sat2: 'at 10% 60%',
    },
  };
  
  const c = configs[position];
  
  // Sovrapposizione di 3 gradienti radiali:
  // 1. (Top) Satellite 1: crea un'irregolarità specifica
  // 2. (Middle) Satellite 2: crea un'altra irregolarità
  // 3. (Bottom) Main: il bagliore principale che riempie l'angolo
  // L'uso di "farthest-side" e dimensioni fisse in px aiuta a modellare la forma.
  return `
    radial-gradient(circle 200px ${c.sat1}, ${accentColor} 0%, transparent 80%),
    radial-gradient(circle 200px ${c.sat2}, ${accentColor} 0%, transparent 80%),
    radial-gradient(circle farthest-corner ${c.main}, ${accentColor} 0%, transparent 90%),
    linear-gradient(to bottom, ${baseBlue}, ${baseBlue})
  `;
};

export const TIPS: Tip[] = [
  {
    id: 1,
    text: "Prima di giocare definisci una somma fissa e un tempo determinato per il gioco.",
    color: createOrganicGradient(COLORS.tertiaryPurple, 'top-right')
  },
  {
    id: 2,
    text: "Non giocare mai con denaro ricevuto in prestito o destinato ad altri scopi (es. affitto, bollette, regali per i figli).",
    color: createOrganicGradient(COLORS.secondaryOrange, 'top-right')
  },
  {
    id: 3,
    text: "Gioca per divertirti e non pensare al gioco come una fonte di reddito.",
    color: createOrganicGradient(COLORS.primaryLightblue, 'top-right')
  },
  {
    id: 4,
    text: "Informati sulle regole del gioco e le probabilità di vincita.",
    color: createOrganicGradient(COLORS.secondaryOrange, 'top-left')
  },
  {
    id: 5,
    text: "Non giocare mai se il gioco ti obbliga a trascurare i tuoi impegni sociali, familiari o professionali.",
    color: createOrganicGradient('#7A3E99', 'top-right') // Custom Purple for better match
  },
  {
    id: 6,
    text: "Ricorda che non puoi condizionare la probabilità di vincita.",
    color: createOrganicGradient(COLORS.primaryLightblue, 'bottom-right')
  },
  {
    id: 7,
    text: "Non mentire sulle perdite e sulle somme spese per il gioco.",
    color: createOrganicGradient(COLORS.tertiaryOchre, 'top-left')
  },
  {
    id: 8,
    text: "Non giocare dopo aver assunto alcool o droghe.",
    color: createOrganicGradient(COLORS.primaryGray, 'top-right')
  },
  {
    id: 9,
    text: "Fai spesso una pausa dal gioco e non perdere mai il controllo di te stesso.",
    color: createOrganicGradient(COLORS.tertiaryPurple, 'bottom-left')
  },
];

