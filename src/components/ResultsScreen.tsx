import React, { useState, useEffect } from 'react';
import { RotateCcw, Share2, Trophy, Brain, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { TestResult, UserAnswer, Question } from '../types';
import { calculateTestResult, getPerformanceLevel, getPerformanceColor, formatTime } from '../utils/scoring';
import { motivationalQuotes, funFacts } from '../data/celebrities';
import questionsData from '../data/questions.json';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vtlxbfmepwnhsxjmmsva.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bHhiZm1lcHduaHN4am1tc3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjYxODcsImV4cCI6MjA2NzIwMjE4N30.6DPOWkJIrWHqlE2hSnpI16DmbTZspUZeWUMmDVlhwcE';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ResultsScreenProps {
  userAnswers: UserAnswer[];
  userName: string;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userAnswers, userName, onRestart }) => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);
  const [randomQuote, setRandomQuote] = useState('');
  const [randomFact, setRandomFact] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    const testResult = calculateTestResult(userAnswers);
    setResult(testResult);
    setRandomQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    setRandomFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    submitResults(testResult);
  }, [userAnswers]);

  const questions = questionsData as Question[];

  const submitResults = async (testResult: TestResult) => {
    setSubmissionStatus('submitting');
    try {
      // First, test the connection by trying to select from the table
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('results')
        .select('id')
        .limit(1);
      
      console.log('Connection test result:', { testData, testError });
      
      if (testError) {
        throw new Error(`Connection test failed: ${testError.message} (${testError.code})`);
      }
      
      const timeExpiredAnswers = userAnswers.filter(answer => answer.timeExpired).length;
      const totalTimeSpent = userAnswers.reduce((total, answer) => total + (answer.timeSpent || 0), 0);
      
      const submissionData = {
        name: userName,
        score: testResult.score,
        total_questions: testResult.totalQuestions,
        iq_score: testResult.iqScore,
        percentage: parseFloat(testResult.percentage.toFixed(2)),
        time_spent: totalTimeSpent,
        time_expired_count: timeExpiredAnswers,
        answers: userAnswers,
      };
      
      console.log('Attempting to submit to Supabase:', submissionData);
      console.log('Supabase URL:', SUPABASE_URL);
      console.log('Supabase client:', supabase);
      
      const { data, error } = await supabase.from('results').insert([submissionData]);
      
      console.log('Supabase response:', { data, error });
      console.log('Error details:', error ? {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      } : 'No error');
      
      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Supabase error: ${error.message} (${error.code})`);
      }
      
      setSubmissionStatus('success');
      setSubmissionMessage('Your results have been saved successfully!');
    } catch (error) {
      console.error('Error submitting results:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      setSubmissionStatus('error');
      setSubmissionMessage(`Failed to save results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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

  // Calculate time statistics
  const timeExpiredAnswers = userAnswers.filter(answer => answer.timeExpired).length;
  const totalTimeSpent = userAnswers.reduce((total, answer) => total + (answer.timeSpent || 0), 0);
  const averageTimePerQuestion = totalTimeSpent / userAnswers.length;

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
        {/* Submission Status */}
        {submissionStatus !== 'idle' && (
          <div className={`p-4 rounded-lg border ${
            submissionStatus === 'success' 
              ? 'bg-green-50 border-green-200' 
              : submissionStatus === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2">
              {submissionStatus === 'submitting' && (
                <Brain className="animate-spin text-blue-600" size={20} />
              )}
              {submissionStatus === 'success' && (
                <CheckCircle className="text-green-600" size={20} />
              )}
              {submissionStatus === 'error' && (
                <AlertCircle className="text-red-600" size={20} />
              )}
              <span className={`text-sm font-medium ${
                submissionStatus === 'success' 
                  ? 'text-green-800' 
                  : submissionStatus === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}>
                {submissionStatus === 'submitting' && 'Saving your results...'}
                {submissionStatus === 'success' && submissionMessage}
                {submissionStatus === 'error' && submissionMessage}
              </span>
            </div>
          </div>
        )}

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
              Here are your results, {userName}
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

          {/* Time Statistics */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
              <Clock className="mr-2" size={24} />
              Time Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(totalTimeSpent)}
                </div>
                <p className="text-sm text-gray-600">Total Time</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {formatTime(Math.round(averageTimePerQuestion))}
                </div>
                <p className="text-sm text-gray-600">Average per Question</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {timeExpiredAnswers}
                </div>
                <p className="text-sm text-gray-600">Time Expired</p>
              </div>
            </div>
            {timeExpiredAnswers > 0 && (
              <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  ⚠️ You ran out of time on {timeExpiredAnswers} question{timeExpiredAnswers > 1 ? 's' : ''}. 
                  Remember, you can't go back to previous questions once you click "Next"!
                </p>
              </div>
            )}
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
                      <div className="flex items-center space-x-2">
                        {userAnswer?.timeExpired && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ⏰ Time Expired
                          </span>
                        )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{question.question}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Correct Answer:</span> {question.options[question.correctAnswer]}
                    </p>
                    {userAnswer && (
                      <div className="text-sm text-gray-600 mb-2">
                        <p>
                        <span className="font-medium">Your Answer:</span> {question.options[userAnswer.selectedOption]}
                      </p>
                        {userAnswer.timeSpent && (
                          <p>
                            <span className="font-medium">Time Spent:</span> {formatTime(userAnswer.timeSpent)}
                          </p>
                        )}
                      </div>
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