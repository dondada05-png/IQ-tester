import { TestResult, Celebrity, UserAnswer } from '../types';
import { celebrities } from '../data/celebrities';

export function calculateIQScore(correctAnswers: number): number {
  // More realistic scale: 0 correct = IQ 70, 5 correct = IQ 100, 10 correct = IQ 130
  // Formula: IQ = 70 + (correctAnswers * 6)
  const iqScore = 70 + (correctAnswers * 6);
  return Math.min(Math.max(iqScore, 70), 160); // Clamp between 70-160
}

export function findCelebrityMatch(iqScore: number): Celebrity {
  if (iqScore < 85) return celebrities[0]; // Forrest Gump (70-85)
  if (iqScore < 100) return celebrities[1]; // Average Person (85-100)
  if (iqScore < 115) return celebrities[2]; // Tom Cruise (100-115)
  if (iqScore < 130) return celebrities[3]; // Natalie Portman (115-130)
  if (iqScore < 145) return celebrities[4]; // Nikola Tesla (130-145)
  if (iqScore < 160) return celebrities[5]; // Stephen Hawking (145-160)
  return celebrities[6]; // Terence Tao (160+)
}

export function calculateTestResult(userAnswers: UserAnswer[]): TestResult {
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const totalQuestions = userAnswers.length;
  const iqScore = calculateIQScore(correctAnswers);
  const celebrity = findCelebrityMatch(iqScore);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return {
    score: correctAnswers,
    totalQuestions,
    iqScore,
    celebrity,
    percentage
  };
}

export function getPerformanceLevel(percentage: number): string {
  if (percentage >= 90) return "Exceptional";
  if (percentage >= 80) return "Superior";
  if (percentage >= 70) return "Above Average";
  if (percentage >= 60) return "Average";
  if (percentage >= 50) return "Below Average";
  return "Needs Improvement";
}

export function getPerformanceColor(percentage: number): string {
  if (percentage >= 90) return "text-emerald-600";
  if (percentage >= 80) return "text-blue-600";
  if (percentage >= 70) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  if (percentage >= 50) return "text-orange-600";
  return "text-red-600";
}

export function getTimeLimitForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 30;
    case 'medium': return 45;
    case 'hard': return 60;
    case 'extreme': return 90;
    default: return 45;
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
} 