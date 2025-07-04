import { Question } from '../types';

export function getRandomQuestions(allQuestions: Question[]): Question[] {
  // Categorize questions by difficulty
  const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
  const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');
  const extremeQuestions = allQuestions.filter(q => q.difficulty === 'extreme');

  // Define how many questions we want from each difficulty level
  const distribution = {
    easy: 3,     // 3 easy questions
    medium: 4,   // 4 medium questions
    hard: 2,     // 2 hard questions
    extreme: 1   // 1 extreme question
  };

  const selectedQuestions: Question[] = [];

  // Randomly select from each difficulty category
  selectedQuestions.push(...getRandomFromArray(easyQuestions, distribution.easy));
  selectedQuestions.push(...getRandomFromArray(mediumQuestions, distribution.medium));
  selectedQuestions.push(...getRandomFromArray(hardQuestions, distribution.hard));
  selectedQuestions.push(...getRandomFromArray(extremeQuestions, distribution.extreme));

  // Shuffle the final array to mix up the order
  return shuffleArray(selectedQuestions);
}

// Helper function to get random items from an array
function getRandomFromArray<T>(array: T[], count: number): T[] {
  const shuffled = [...array];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// Alternative function for completely random selection (no difficulty distribution)
export function getCompletelyRandomQuestions(allQuestions: Question[], count: number = 10): Question[] {
  return getRandomFromArray(allQuestions, count);
}

// Function to get questions with progressive difficulty (easier to harder)
export function getProgressiveDifficultyQuestions(allQuestions: Question[]): Question[] {
  const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
  const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');
  const extremeQuestions = allQuestions.filter(q => q.difficulty === 'extreme');

  const selectedQuestions: Question[] = [];

  // Select questions to create a progressive difficulty curve
  selectedQuestions.push(...getRandomFromArray(easyQuestions, 2));    // Start with 2 easy
  selectedQuestions.push(...getRandomFromArray(mediumQuestions, 3));  // Then 3 medium
  selectedQuestions.push(...getRandomFromArray(hardQuestions, 3));    // Then 3 hard
  selectedQuestions.push(...getRandomFromArray(extremeQuestions, 2)); // End with 2 extreme

  // Don't shuffle - keep the progressive order
  return selectedQuestions;
} 