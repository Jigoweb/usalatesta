import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "Hai puntato più denaro di quanto potessi permetterti di perdere?",
  },
  {
    id: 2,
    text: "Hai sentito il bisogno di giocare somme di denaro sempre più elevate per ottenere la stessa eccitazione?",
  },
  {
    id: 3,
    text: "Hai tentato di recuperare il denaro perso tornando a giocare un altro giorno (“inseguire le perdite”)?",
  },
  {
    id: 4,
    text: "Hai preso in prestito denaro o venduto qualcosa per avere soldi da giocare?",
  },
  {
    id: 5,
    text: "Hai sentito che il tuo gioco d’azzardo poteva essere un problema per te?",
  },
  {
    id: 6,
    text: "Il gioco ti ha causato problemi di salute, inclusi stress o ansia?",
  },
  {
    id: 7,
    text: "Altre persone ti hanno criticato per il tuo modo di giocare o ti hanno detto che avevi un problema?",
  },
  {
    id: 8,
    text: "Il tuo gioco ha causato problemi finanziari a te o alla tua famiglia?",
  },
  {
    id: 9,
    text: "Ti sei sentito in colpa per il modo in cui giochi o per ciò che accade quando giochi?",
  },
];

export const SCORING = {
  0: "Mai",
  1: "A volte",
  2: "Spesso",
  3: "Quasi sempre"
};

export const getRiskLevel = (score: number) => {
  if (score === 0) return { level: 'none', label: 'Nessun problema', color: 'bg-green-500' };
  if (score <= 2) return { level: 'low', label: 'Rischio basso', color: 'bg-yellow-500' };
  if (score <= 7) return { level: 'moderate', label: 'Rischio moderato', color: 'bg-orange-500' };
  return { level: 'problematic', label: 'Gioco problematico', color: 'bg-red-600' };
};
