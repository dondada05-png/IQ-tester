import React, { useState, useEffect } from 'react';
import { RotateCcw, Share2, Trophy, Brain, Star } from 'lucide-react';
import { TestResult, UserAnswer, Question } from '../types';
import { calculateTestResult, getPerformanceLevel, getPerformanceColor } from '../utils/scoring';
import { motivationalQuotes, funFacts } from '../data/celebrities';
import questionsData from '../data/questions.json';

interface ResultsScreenProps {
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userAnswers, onRestart }) => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);
  const [randomQuote, setRandomQuote] = useState('');
  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    const testResult = calculateTestResult(userAnswers);
    setResult(testResult);
    
    // Set random quote and fact
    setRandomQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    setRandomFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  }, [userAnswers]);

  const questions = questionsData as Question[];

  const handleShare = () => {
    if (result) {
      const text = `I just completed an IQ test and scored ${result.iqScore} - same as ${result.celebrity.name}! 🧠✨`;
      if (navigator.share) {
        navigator.share({
          title: 'My IQ Test Results',
          text,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(text);
        alert('Results copied to clipboard!');
      }
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="animate-pulse text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Calculating your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Main Results Card */}
        <div className="card text-center animate-fade-in">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <Trophy size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Test Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Here are your results
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              {result.iqScore}
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              Your IQ Score
            </p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="text-yellow-500" size={20} />
              <span className={`text-lg font-semibold ${getPerformanceColor(result.percentage)}`}>
                {getPerformanceLevel(result.percentage)}
              </span>
              <Star className="text-yellow-500" size={20} />
            </div>
            <p className="text-lg text-gray-600">
              You answered <span className="font-semibold text-blue-600">{result.score}</span> out of{' '}
              <span className="font-semibold">{result.totalQuestions}</span> questions correctly
              <span className="text-gray-500"> ({result.percentage}%)</span>
            </p>
          </div>

          {/* Celebrity Comparison */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              🌟 Celebrity Comparison
            </h3>
            <div className="text-lg">
              <p className="mb-2">
                <span className="font-semibold">Your IQ is {result.iqScore} – same as</span>
              </p>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {result.celebrity.name}
              </p>
              <p className="text-gray-600 italic">
                {result.celebrity.description}
              </p>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-3">
                IQ Range: {result.celebrity.iqRange}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={onRestart}
              className="btn btn-primary flex items-center justify-center"
            >
              <RotateCcw size={20} className="mr-2" />
              Take Test Again
            </button>
            <button
              onClick={handleShare}
              className="btn btn-secondary flex items-center justify-center"
            >
              <Share2 size={20} className="mr-2" />
              Share Results
            </button>
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="btn btn-secondary"
            >
              {showExplanations ? 'Hide' : 'Show'} Explanations
            </button>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">💭 Inspirational Quote</h4>
            <p className="text-gray-700 italic">"{randomQuote}"</p>
          </div>

          {/* Fun Fact */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-2">🧠 Brain Fact</h4>
            <p className="text-gray-700">{randomFact}</p>
          </div>
        </div>

        {/* Explanations */}
        {showExplanations && (
          <div className="card animate-fade-in">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Question Explanations
            </h3>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.id);
                const isCorrect = userAnswer?.isCorrect || false;
                
                return (
                  <div key={question.id} className="border-l-4 border-gray-200 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">
                        Question {index + 1}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{question.question}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Correct Answer:</span> {question.options[question.correctAnswer]}
                    </p>
                    {userAnswer && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Your Answer:</span> {question.options[userAnswer.selectedOption]}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsScreen; 