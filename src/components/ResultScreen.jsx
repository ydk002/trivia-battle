import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Save, Check, Award, ArrowRight } from 'lucide-react';
import { saveScore } from '../utils/leaderboard';
import { soundFx } from '../utils/audio';

export default function ResultScreen({
  score,
  totalQuestions,
  difficulty,
  onRestart,
  onOpenLeaderboard
}) {
  const [playerName, setPlayerName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    if (percentage >= 60) {
      soundFx.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  const handleSaveScore = (e) => {
    e.preventDefault();
    if (isSaved) return;

    soundFx.playClick();
    saveScore({
      name: playerName.trim() || 'Névtelen Harcos',
      score,
      total: totalQuestions,
      difficulty
    });
    setIsSaved(true);
    setTimeout(() => {
      onOpenLeaderboard();
    }, 400);
  };

  const getEvaluation = () => {
    if (percentage === 100) return { title: 'Tökéletes Teljesítmény! 🏆', desc: 'Minden kérdésre tudtad a helyes választ! Igazi Trivia Mester vagy!' };
    if (percentage >= 80) return { title: 'Kiváló Eredmény! 🌟', desc: 'Nagyon szép tudásról tettél tanúbizonyságot!' };
    if (percentage >= 60) return { title: 'Szép Munka! 👍', desc: 'A kérdések többségét sikeresen megválaszoltad.' };
    if (percentage >= 40) return { title: 'Nem Rossz Próbálkozás! ⚡', desc: 'Egy kis gyakorlással a csúcsra érhetsz.' };
    return { title: 'Gyakorolj Még Kicsit! 💡', desc: 'Ne csüggedj, a következő menet biztosan jobb lesz!' };
  };

  const evalData = getEvaluation();

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        background: percentage >= 60 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(99, 102, 241, 0.15)',
        border: percentage >= 60 ? '2px solid rgba(251, 191, 36, 0.4)' : '2px solid rgba(99, 102, 241, 0.4)',
        margin: '0 auto 1.5rem auto'
      }}>
        <Trophy size={42} color={percentage >= 60 ? '#fbbf24' : '#818cf8'} />
      </div>

      <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem' }}>
        {evalData.title}
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        {evalData.desc}
      </p>

      {/* Score Box */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-card)',
        padding: '1.75rem 1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
          Végső Eredmény
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '3.2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #a5b4fc, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0.25rem 0'
        }}>
          {score} / {totalQuestions}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: percentage >= 60 ? '#34d399' : '#f87171' }}>
          {percentage}% Helyes válaszarány
        </div>
      </div>

      {/* Save to Leaderboard Form */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-card)',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <Award size={18} color="#fbbf24" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Mentés a Ranglistára</h3>
        </div>

        {!isSaved ? (
          <form onSubmit={handleSaveScore} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add meg a játékosneved..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              style={{ flex: 1, minWidth: '200px' }}
              autoFocus
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.8rem 1.4rem', whiteSpace: 'nowrap' }}
            >
              <Save size={18} />
              <span>Mentés</span>
            </button>
          </form>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: '#34d399',
            fontSize: '0.92rem',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={18} />
              <span>Pontszám sikeresen rögzítve a Top 5 listában!</span>
            </div>
            <button
              type="button"
              onClick={onOpenLeaderboard}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#34d399',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.85rem'
              }}
            >
              <span>Megtekintés</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          onClick={() => {
            soundFx.playClick();
            onRestart();
          }}
          style={{ flex: 1, minWidth: '180px' }}
        >
          <RotateCcw size={18} />
          <span>Új játék indítása</span>
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            soundFx.playClick();
            onOpenLeaderboard();
          }}
          style={{ flex: 1, minWidth: '180px' }}
        >
          <Trophy size={18} color="#fbbf24" />
          <span>Ranglista megtekintése</span>
        </button>
      </div>
    </div>
  );
}
