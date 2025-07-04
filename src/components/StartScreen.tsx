import React, { useState } from 'react';
import { Brain, Clock, Target, Zap, AlertTriangle, ArrowRight, Code, User } from 'lucide-react';

interface StartScreenProps {
  onStart: (name: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleStart = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Please enter your name to continue');
      return;
    }
    if (trimmedName.length < 2) {
      setNameError('Name must be at least 2 characters long');
      return;
    }
    if (trimmedName.length > 50) {
      setNameError('Name must be less than 50 characters');
      return;
    }
    setNameError('');
    onStart(trimmedName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card text-center animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <Brain size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              IQ Tester
            </h1>
            <p className="text-xl text-gray-600">
              Discover Your Intelligence Quotient
            </p>
          </div>

          {/* Developer Credit */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <Code className="text-blue-600" size={20} />
              <span className="text-sm text-gray-700">
                Developed by <span className="font-semibold text-blue-600">Rusango A. Salvator</span>
              </span>
            </div>
          </div>

          {/* Name Input */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
              <User className="mr-2 text-blue-600" size={20} />
              Enter Your Name
            </h2>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name here..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  nameError ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={50}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-2 text-left">{nameError}</p>
              )}
              <p className="text-gray-500 text-xs mt-2 text-left">
                Enter your name to start the test
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-4">
              <Clock className="text-blue-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800">Timed Questions</h3>
              <p className="text-sm text-gray-600">30-90 seconds per question</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Target className="text-green-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800">Accurate Results</h3>
              <p className="text-sm text-gray-600">Professional assessment</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Zap className="text-purple-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800">Instant Analysis</h3>
              <p className="text-sm text-gray-600">Compare with celebrities</p>
            </div>
          </div>

          {/* Important Rules */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center justify-center">
              <AlertTriangle className="mr-2 text-orange-600" size={20} />
              Important Rules
            </h2>
            <div className="text-left text-gray-700 space-y-3">
              <div className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span><strong>No Going Back:</strong> Once you click "Next", you cannot return to previous questions</span>
              </div>
              <div className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span><strong>Time Limits:</strong> Easy (30s), Medium (45s), Hard (60s), Extreme (90s)</span>
              </div>
              <div className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span><strong>Time Penalty:</strong> If time expires, you lose the point for that question</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              What to Expect
            </h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                10 randomly selected questions from our database of 70+ questions
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Questions increase in difficulty progressively
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Each test provides a unique experience - no two tests are alike!
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Instant IQ score calculation and celebrity comparison
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Detailed explanations for each question
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Time performance analysis in your results
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className={`btn text-lg px-8 py-4 w-full md:w-auto transition-all duration-200 ${
              name.trim() 
                ? 'btn-primary hover:scale-105 transform' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start IQ Test
          </button>

          <p className="text-sm text-gray-500 mt-4">
            No registration required • Completely free • Takes 5-10 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen; 