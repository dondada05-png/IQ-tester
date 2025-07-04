import React from 'react';
import { Brain, Clock, Target, Zap } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
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

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-4">
              <Clock className="text-blue-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800">Quick Test</h3>
              <p className="text-sm text-gray-600">10 questions, 5-10 minutes</p>
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

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              What to Expect
            </h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                10 randomly selected questions from our database of 55+ questions
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
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={onStart}
            className="btn btn-primary text-lg px-8 py-4 w-full md:w-auto hover:scale-105 transform transition-all duration-200"
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