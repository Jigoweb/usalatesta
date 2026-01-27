export interface TimerState {
  duration: number; // in minutes
  timeRemaining: number; // in seconds  
  isActive: boolean;
  isPaused: boolean;
  startTime: number | null;
  endTime: number | null;
}

export interface TimerHistory {
  id: string;
  duration: number;
  completedAt: number;
  wasCompleted: boolean;
}

export interface QuizQuestion {
  id: number;
  text: string;
  image?: string;
}

export interface QuizAnswer {
  questionId: number;
  value: 0 | 1 | 2 | 3;
}

export interface QuizResult {
  totalScore: number;
  riskLevel: 'none' | 'low' | 'moderate' | 'problematic';
  answers: QuizAnswer[];
  date: string;
}

export interface HelpCenter {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  services: string[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: number;
}
