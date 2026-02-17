import { QuizQuestion } from '../types';
import img1 from '../assets/images/test/usa-la-testa_img-test-1.jpg';
import img2 from '../assets/images/test/usa-la-testa_img-test-2.jpg';
import img3 from '../assets/images/test/usa-la-testa_img-test-3.jpg';
import img4 from '../assets/images/test/usa-la-testa_img-test-4.jpg';
import img5 from '../assets/images/test/usa-la-testa_img-test-5.jpg';
import img6 from '../assets/images/test/usa-la-testa_img-test-6.jpg';
import img7 from '../assets/images/test/usa-la-testa_img-test-7.jpg';
import img8 from '../assets/images/test/usa-la-testa_img-test-8.jpg';
import img9 from '../assets/images/test/usa-la-testa_img-test-9.jpg';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "Hai puntato più denaro di quanto potessi permetterti di perdere?",
    image: img1
  },
  {
    id: 2,
    text: "Hai sentito il bisogno di giocare somme di denaro sempre più elevate per ottenere la stessa eccitazione?",
    image: img2
  },
  {
    id: 3,
    text: "Hai tentato di recuperare il denaro perso tornando a giocare un altro giorno (“inseguire le perdite”)?",
    image: img3
  },
  {
    id: 4,
    text: "Hai preso in prestito denaro o venduto qualcosa per avere soldi da giocare?",
    image: img4
  },
  {
    id: 5,
    text: "Hai sentito che il tuo gioco d’azzardo poteva essere un problema per te?",
    image: img5
  },
  {
    id: 6,
    text: "Il gioco ti ha causato problemi di salute, inclusi stress o ansia?",
    image: img6
  },
  {
    id: 7,
    text: "Altre persone ti hanno criticato per il tuo modo di giocare o ti hanno detto che avevi un problema?",
    image: img7
  },
  {
    id: 8,
    text: "Il tuo gioco ha causato problemi finanziari a te o alla tua famiglia?",
    image: img8
  },
  {
    id: 9,
    text: "Ti sei sentito in colpa per il modo in cui giochi o per ciò che accade quando giochi?",
    image: img9
  },
];

export const SCORING = {
  0: "Mai",
  1: "A volte",
  2: "Spesso",
  3: "Quasi sempre"
};

export const getRiskLevel = (score: number) => {
  if (score === 0) return { level: 'none', label: 'Nessun problema', color: 'bg-tertiary-green', textColor: 'text-tertiary-green' };
  if (score <= 2) return { level: 'low', label: 'Rischio basso', color: 'bg-tertiary-ochre', textColor: 'text-tertiary-ochre' };
  if (score <= 7) return { level: 'moderate', label: 'Rischio moderato', color: 'bg-secondary-orange', textColor: 'text-secondary-orange' };
  return { level: 'problematic', label: 'Gioco problematico', color: 'bg-secondary-bordeaux', textColor: 'text-secondary-bordeaux' };
};
