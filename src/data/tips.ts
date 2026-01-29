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
  startColor: string,
  endColor: string,
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center',
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const positions = {
    'top-left': '0% 0%',
    'top-right': '100% 0%',
    'bottom-left': '0% 100%',
    'bottom-right': '100% 100%',
    'center': '50% 50%',
  };
  
  const sizes = {
    'small': '30%',
    'medium': '50%',
    'large': '70%',
  };
  
  const pos = positions[position];
  const blobSize = sizes[size];
  
  // Crea un gradiente radiale che forma un "blob" organico morbido
  // combinato con un gradiente lineare per la base
  // Il blob ha bordi molto morbidi per un effetto organico
  return `
    radial-gradient(ellipse ${blobSize} ${blobSize} at ${pos}, ${endColor} 0%, ${endColor} 35%, transparent 65%),
    radial-gradient(ellipse ${blobSize} ${blobSize} at ${pos}, ${endColor} 0%, transparent 50%),
    linear-gradient(135deg, ${startColor} 0%, ${startColor} 25%, ${endColor} 100%)
  `;
};

export const TIPS: Tip[] = [
  {
    id: 1,
    text: "Prima di giocare definisci una somma fissa e un tempo determinato per il gioco.",
    // Primary Blue con blob di Purple dal top-left (blob medio-grande)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.tertiaryPurple, 'top-left', 'large')
  },
  {
    id: 2,
    text: "Non giocare mai con denaro ricevuto in prestito o destinato ad altri scopi (es. affitto, bollette, regali per i figli).",
    // Primary Blue con blob di Orange dal bottom-right (blob grande)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.secondaryOrange, 'bottom-right', 'large')
  },
  {
    id: 3,
    text: "Gioca per divertirti e non pensare al gioco come una fonte di reddito.",
    // Primary Blue con blob di Light Blue dal bottom-right (blob medio)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.primaryLightblue, 'bottom-right', 'medium')
  },
  {
    id: 4,
    text: "Informati sulle regole del gioco e le probabilità di vincita.",
    // Primary Blue con blob di Orange dal top-left (blob grande, come nell'immagine)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.secondaryOrange, 'top-left', 'large')
  },
  {
    id: 5,
    text: "Non giocare mai se il gioco ti obbliga a trascurare i tuoi impegni sociali, familiari o professionali.",
    // Primary Blue con blob di Bordeaux dal bottom-right (blob medio-grande, come nell'immagine)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.secondaryBordeaux, 'bottom-right', 'large')
  },
  {
    id: 6,
    text: "Ricorda che non puoi condizionare la probabilità di vincita.",
    // Primary Blue con blob di Green dal bottom-right (blob medio)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.tertiaryGreen, 'bottom-right', 'medium')
  },
  {
    id: 7,
    text: "Non mentire sulle perdite e sulle somme spese per il gioco.",
    // Primary Blue con blob di Ochre dal top-left (blob grande)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.tertiaryOchre, 'top-left', 'large')
  },
  {
    id: 8,
    text: "Non giocare dopo aver assunto alcool o droghe.",
    // Primary Blue con blob di Gray dal center (blob piccolo-medio)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.primaryGray, 'center', 'medium')
  },
  {
    id: 9,
    text: "Fai spesso una pausa dal gioco e non perdere mai il controllo di te stesso.",
    // Primary Blue con blob di Purple dal bottom-right (blob medio)
    color: createOrganicGradient(COLORS.primaryBlue, COLORS.tertiaryPurple, 'bottom-right', 'medium')
  },
];

