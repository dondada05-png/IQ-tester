import { useState } from 'react';
import { ScreenType, UserAnswer } from './types';
import StartScreen from './components/StartScreen';
import QuizInterface from './components/QuizInterface';
import ResultsScreen from './components/ResultsScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('start');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [userName, setUserName] = useState<string>('');

  const handleStartTest = (name: string) => {
    setUserName(name);
    setCurrentScreen('quiz');
    setUserAnswers([]);
  };

  const handleCompleteTest = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setCurrentScreen('results');
  };

  const handleRestart = () => {
    setCurrentScreen('start');
    setUserAnswers([]);
    setUserName('');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onStart={handleStartTest} />;
      case 'quiz':
        return <QuizInterface onComplete={handleCompleteTest} />;
      case 'results':
        return <ResultsScreen userAnswers={userAnswers} userName={userName} onRestart={handleRestart} />;
      default:
        return <StartScreen onStart={handleStartTest} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App; 