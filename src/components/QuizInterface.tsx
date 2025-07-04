import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Shuffle } from 'lucide-react';
import { Question, UserAnswer } from '../types';
import questionsData from '../data/questions.json';
import { getProgressiveDifficultyQuestions } from '../utils/questionSelector';

interface QuizInterfaceProps {
  onComplete: (answers: UserAnswer[]) => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize questions on component mount
  useEffect(() => {
    const allQuestions = questionsData as Question[];
    const selectedQuestions = getProgressiveDifficultyQuestions(allQuestions);
    setQuestions(selectedQuestions);
    setIsLoading(false);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    // Load existing answer for current question
    if (currentQuestion) {
      const existingAnswer = userAnswers.find(answer => answer.questionId === currentQuestion.id);
      setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
    }
  }, [currentQuestionIndex, userAnswers, currentQuestion]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect
    };

    // Update or add the answer
    const updatedAnswers = userAnswers.filter(answer => answer.questionId !== currentQuestion.id);
    updatedAnswers.push(newAnswer);
    setUserAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Complete the test
      onComplete(updatedAnswers);
    } else {
      // Move to next question
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const shuffleQuestions = () => {
    setIsLoading(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      const allQuestions = questionsData as Question[];
      const selectedQuestions = getProgressiveDifficultyQuestions(allQuestions);
      setQuestions(selectedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedOption(null);
      setIsLoading(false);
    }, 500);
  };

  // Show loading state while questions are being selected
  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Shuffle className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Preparing your personalized IQ test...</p>
          <p className="text-sm text-gray-500 mt-2">Selecting random questions from our database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className={`card transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
                <button
                  onClick={shuffleQuestions}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  title="Get new random questions"
                >
                  <Shuffle size={12} />
                  <span>New Questions</span>
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`question-option ${selectedOption === index ? 'selected' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === index 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === index && (
                        <CheckCircle size={16} className="text-white" />
                      )}
                    </div>
                    <span className="text-left flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`btn btn-secondary flex items-center ${
                currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {userAnswers.length} of {questions.length} answered
            </div>

            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`btn btn-primary flex items-center ${
                selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLastQuestion ? 'Complete Test' : 'Next'}
              {!isLastQuestion && <ChevronRight size={20} className="ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface; 