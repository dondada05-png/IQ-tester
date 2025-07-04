import { TestResult, Celebrity, UserAnswer } from '../types';
import { celebrities } from '../data/celebrities';

export function calculateIQScore(correctAnswers: number): number {
  // More realistic and punishing scale:
  // 0 correct = IQ 60 (very low)
  // 5 correct = IQ 85 (below average)
  // 10 correct = IQ 100 (average)
  // 15 correct = IQ 115 (above average)
  // 20 correct = IQ 130 (high)
  // 25 correct = IQ 145 (very high)
  // 30+ correct = IQ 160+ (genius)
  
  // Formula: IQ = 60 + (correctAnswers * 2.5)
  // This makes the test much more challenging and realistic
  const iqScore = 60 + (correctAnswers * 2.5);
  // Round to nearest integer to avoid decimal issues with database
  return Math.min(Math.max(Math.round(iqScore), 60), 180); // Clamp between 60-180 and round
}

export function findCelebrityMatch(iqScore: number): Celebrity {
  if (iqScore < 70) return celebrities[0]; // Forrest Gump (60-70)
  if (iqScore < 85) return celebrities[1]; // Below Average (70-85)
  if (iqScore < 100) return celebrities[2]; // Average Person (85-100)
  if (iqScore < 115) return celebrities[3]; // Above Average (100-115)
  if (iqScore < 130) return celebrities[4]; // High IQ (115-130)
  if (iqScore < 145) return celebrities[5]; // Very High IQ (130-145)
  if (iqScore < 160) return celebrities[6]; // Genius Level (145-160)
  return celebrities[7]; // Super Genius (160+)
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
  if (percentage >= 40) return "Poor";
  if (percentage >= 30) return "Very Poor";
  return "Extremely Poor";
}

export function getPerformanceColor(percentage: number): string {
  if (percentage >= 90) return "text-emerald-600";
  if (percentage >= 80) return "text-blue-600";
  if (percentage >= 70) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  if (percentage >= 50) return "text-orange-600";
  if (percentage >= 40) return "text-red-600";
  if (percentage >= 30) return "text-red-700";
  return "text-red-800";
}

export function getTimeLimitForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 45; // Increased time for harder easy questions
    case 'medium': return 60;
    case 'hard': return 75;
    case 'extreme': return 90;
    default: return 60;
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
} 