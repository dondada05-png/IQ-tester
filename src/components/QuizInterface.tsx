import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Shuffle, Clock } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Get time limit based on difficulty
  const getTimeLimit = (difficulty: string): number => {
    switch (difficulty) {
      case 'easy': return 30;
      case 'medium': return 45;
      case 'hard': return 60;
      case 'extreme': return 90;
      default: return 45;
    }
  };

  // Initialize questions on component mount
  useEffect(() => {
    const allQuestions = questionsData as Question[];
    const selectedQuestions = getProgressiveDifficultyQuestions(allQuestions);
    setQuestions(selectedQuestions);
    setIsLoading(false);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Initialize timer for current question
  useEffect(() => {
    if (currentQuestion) {
      const timeLimit = getTimeLimit(currentQuestion.difficulty);
      setTimeLeft(timeLimit);
      setTimeExpired(false);
      setQuestionStartTime(Date.now());
      
      // Load existing answer for current question
      const existingAnswer = userAnswers.find(answer => answer.questionId === currentQuestion.id);
      setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || timeExpired) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timeExpired]);

  // Auto-advance when time expires
  useEffect(() => {
    if (timeExpired && selectedOption === null) {
      // Force move to next question after 2 seconds when time expires
      const timeout = setTimeout(() => {
        handleNext(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [timeExpired, selectedOption]);

  const handleOptionSelect = (optionIndex: number) => {
    if (timeExpired) return; // Can't select after time expires
    setSelectedOption(optionIndex);
  };

  const handleNext = (forcedByTime: boolean = false) => {
    if (!forcedByTime && selectedOption === null) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: selectedOption ?? -1, // -1 means no answer selected
      isCorrect: forcedByTime ? false : isCorrect,
      timeSpent,
      timeExpired: forcedByTime || timeExpired
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTimerColor = () => {
    const timeLimit = getTimeLimit(currentQuestion?.difficulty || 'medium');
    const percentage = (timeLeft / timeLimit) * 100;
    
    if (percentage > 60) return 'text-green-600';
    if (percentage > 30) return 'text-yellow-600';
    if (percentage > 10) return 'text-orange-600';
    return 'text-red-600';
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
      setTimeExpired(false);
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

          {/* Timer */}
          <div className="mb-6 flex justify-center">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${
              timeExpired ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <Clock size={20} className={getTimerColor()} />
              <span className={`text-lg font-bold ${getTimerColor()}`}>
                {timeExpired ? 'TIME EXPIRED!' : `${timeLeft}s`}
              </span>
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
                  disabled={timeExpired}
                  className={`question-option ${selectedOption === index ? 'selected' : ''} ${
                    timeExpired ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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

          {/* Time Expired Message */}
          {timeExpired && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">
                Time's up! Moving to next question automatically...
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {userAnswers.length} of {questions.length} answered
            </div>

            <button
              onClick={() => handleNext(false)}
              disabled={selectedOption === null && !timeExpired}
              className={`btn btn-primary flex items-center ${
                (selectedOption === null && !timeExpired) ? 'opacity-50 cursor-not-allowed' : ''
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