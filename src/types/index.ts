export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  explanation?: string;
}

export interface Celebrity {
  name: string;
  iqRange: string;
  description: string;
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  iqScore: number;
  celebrity: Celebrity;
  percentage: number;
}

export type ScreenType = 'start' | 'quiz' | 'results';

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
} 