import { Question } from '../types';

export function getRandomQuestions(allQuestions: Question[]): Question[] {
  // Categorize questions by difficulty
  const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
  const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');
  const extremeQuestions = allQuestions.filter(q => q.difficulty === 'extreme');

  // Define how many questions we want from each difficulty level
  // Increased total questions for a more comprehensive test
  const distribution = {
    easy: 4,     // 4 easy questions (now harder)
    medium: 5,   // 5 medium questions
    hard: 3,     // 3 hard questions
    extreme: 2   // 2 extreme questions
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
  
  // Fisher-Yates shuffle for better randomization
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// Alternative function for completely random selection (no difficulty distribution)
export function getCompletelyRandomQuestions(allQuestions: Question[], count: number = 14): Question[] {
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
  selectedQuestions.push(...getRandomFromArray(easyQuestions, 3));    // Start with 3 easy
  selectedQuestions.push(...getRandomFromArray(mediumQuestions, 4));  // Then 4 medium
  selectedQuestions.push(...getRandomFromArray(hardQuestions, 4));    // Then 4 hard
  selectedQuestions.push(...getRandomFromArray(extremeQuestions, 3)); // End with 3 extreme

  // Don't shuffle - keep the progressive order
  return selectedQuestions;
} 