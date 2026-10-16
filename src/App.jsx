import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LeaderboardModal from './components/LeaderboardModal';
import { fetchTriviaQuestions } from './services/triviaApi';

export default function App() {
  const [gameState, setGameState] = useState('start'); // 'start' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Configuration options
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(15);

  const [loading, setLoading] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const fetched = await fetchTriviaQuestions({ amount, category, difficulty });
      if (fetched && fetched.length > 0) {
        setQuestions(fetched);
        setCurrentIndex(0);
        setScore(0);
        setGameState('quiz');
      } else {
        alert('Nem sikerült kérdéseket betölteni. Kérlek próbáld újra más beállításokkal!');
      }
    } catch (err) {
      console.error(err);
      alert('Hiba történt a kérdések betöltése közben.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelected = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameState('result');
    }
  };

  const handleRestart = () => {
    setGameState('start');
    setCurrentIndex(0);
    setScore(0);
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onHome={handleRestart}
      />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {gameState === 'start' && (
          <StartScreen
            category={category}
            setCategory={setCategory}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            amount={amount}
            setAmount={setAmount}
            timerSeconds={timerSeconds}
            setTimerSeconds={setTimerSeconds}
            onStartGame={handleStartGame}
            loading={loading}
          />
        )}

        {gameState === 'quiz' && questions.length > 0 && (
          <QuizScreen
            questions={questions}
            currentIndex={currentIndex}
            onAnswerSelected={handleAnswerSelected}
            onNextQuestion={handleNextQuestion}
            score={score}
            timerSeconds={timerSeconds}
          />
        )}

        {gameState === 'result' && (
          <ResultScreen
            score={score}
            totalQuestions={questions.length}
            difficulty={difficulty}
            onRestart={handleRestart}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}
      </main>

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <footer className="app-footer">
        <p>🎮 Trivia Battle &copy; {new Date().getFullYear()} – Open Trivia Database API & React</p>
      </footer>
    </div>
  );
}
