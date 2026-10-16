import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { soundFx } from '../utils/audio';

export default function QuizScreen({
  questions,
  currentIndex,
  onAnswerSelected,
  onNextQuestion,
  score,
  timerSeconds = 15,
}) {
  const currentQuestion = questions[currentIndex];
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [isTimeout, setIsTimeout] = useState(false);
  
  const timerRef = useRef(null);

  // Reset state when current index changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsTimeout(false);
    setTimeLeft(timerSeconds);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, timerSeconds]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setIsTimeout(true);
    soundFx.playTimeout();
    onAnswerSelected(false);
  };

  const handleSelectAnswer = (answer) => {
    if (isAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }

    onAnswerSelected(isCorrect);
  };

  const getButtonClass = (answer) => {
    if (!isAnswered) return 'answer-btn';

    if (answer === currentQuestion.correctAnswer) {
      return 'answer-btn correct';
    }

    if (answer === selectedAnswer && answer !== currentQuestion.correctAnswer) {
      return 'answer-btn wrong';
    }

    return 'answer-btn';
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'easy':
        return <span className="badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>Könnyű</span>;
      case 'medium':
        return <span className="badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>Közepes</span>;
      case 'hard':
        return <span className="badge" style={{ background: 'rgba(248, 113, 113, 0.15)', color: '#f87171' }}>Nehéz</span>;
      default:
        return null;
    }
  };

  // Progress percentage
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="glass-card" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Quiz Top Bar */}
      <div className="quiz-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="question-counter">
            KÉRDÉS {currentIndex + 1} / {questions.length}
          </span>
          {getDifficultyBadge(currentQuestion.difficulty)}
        </div>

        <div className={`timer-box ${timeLeft <= 3 ? 'warning' : ''}`}>
          <Clock size={18} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Category */}
      <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.6rem' }}>
        {currentQuestion.category}
      </div>

      {/* Question Text */}
      <h2 className="question-title">
        {currentQuestion.question}
      </h2>

      {/* Answer Options Grid */}
      <div className="answers-grid">
        {currentQuestion.answers.map((ans, idx) => {
          const isThisCorrect = ans === currentQuestion.correctAnswer;
          const isThisSelected = ans === selectedAnswer;

          return (
            <button
              key={idx}
              className={getButtonClass(ans)}
              onClick={() => handleSelectAnswer(ans)}
              disabled={isAnswered}
            >
              <span>{ans}</span>
              {isAnswered && isThisCorrect && (
                <CheckCircle2 size={20} color="#34d399" style={{ flexShrink: 0 }} />
              )}
              {isAnswered && isThisSelected && !isThisCorrect && (
                <XCircle size={20} color="#f87171" style={{ flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {isAnswered && (
        <div className={`feedback-banner ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'wrong'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <>
                <CheckCircle2 size={20} />
                <span>Helyes válasz! (+1 pont)</span>
              </>
            ) : isTimeout ? (
              <>
                <AlertTriangle size={20} />
                <span>Lejárt az idő! A helyes válasz: <strong>{currentQuestion.correctAnswer}</strong></span>
              </>
            ) : (
              <>
                <XCircle size={20} />
                <span>Helytelen válasz! A helyes: <strong>{currentQuestion.correctAnswer}</strong></span>
              </>
            )}
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              soundFx.playClick();
              onNextQuestion();
            }}
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem' }}
          >
            <span>{isLastQuestion ? 'Eredmények' : 'Következő'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
