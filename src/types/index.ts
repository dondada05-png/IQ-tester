export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  explanation?: string;
  timeLimit?: number; // Time limit in seconds for each question
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
  timeSpent?: number; // Time spent on the question in seconds
  timeExpired?: boolean; // Whether the time expired for this question
}

export interface TestSubmission {
  name: string;
  score: number;
  totalQuestions: number;
  iqScore: number;
  percentage: number;
  timeSpent: number;
  timeExpiredCount: number;
  answers: UserAnswer[];
}

export interface DashboardResult {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  iqScore: number;
  percentage: number;
  timeSpent: number;
  timeExpiredCount: number;
  answers: UserAnswer[];
  timestamp: string;
  date: string;
  time: string;
}

export interface DashboardStatistics {
  totalTests: number;
  averageScore: number;
  averageIQ: number;
  averagePercentage: number;
} 