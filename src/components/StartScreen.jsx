import React from 'react';
import { Play, Sparkles, Clock, Flame, ShieldAlert, Award } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../services/triviaApi';
import { soundFx } from '../utils/audio';

export default function StartScreen({
  category,
  setCategory,
  difficulty,
  setDifficulty,
  amount,
  setAmount,
  timerSeconds,
  setTimerSeconds,
  onStartGame,
  loading
}) {
  const handleStart = () => {
    soundFx.playClick();
    onStartGame();
  };

  return (
    <div className="glass-card" style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.15)',
          color: '#a5b4fc',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={16} /> Interaktív Kvíz Párbaj
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
          Készen állsz a kihívásra?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Válaszolj az Open Trivia adatbázis kérdéseire a megadott idő alatt, gyűjtsd a pontokat és kerülj be a Top 5-be!
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Kategória kiválasztása:</label>
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Nehézségi szint:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setDifficulty(diff.id);
                }}
                disabled={loading}
                style={{
                  padding: '0.65rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? `2px solid ${diff.color}` : '1px solid var(--border-card)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                {diff.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Kérdések száma:</label>
          <select
            className="form-select"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={loading}
          >
            <option value={5}>5 kérdés (Gyors menet)</option>
            <option value={10}>10 kérdés (Normál)</option>
            <option value={15}>15 kérdés (Bajnok mód)</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Idő / kérdés:</label>
          <select
            className="form-select"
            value={timerSeconds}
            onChange={(e) => setTimerSeconds(Number(e.target.value))}
            disabled={loading}
          >
            <option value={10}>10 másodperc (Villám)</option>
            <option value={15}>15 másodperc (Klasszikus)</option>
            <option value={20}>20 másodperc (Kényelmes)</option>
          </select>
        </div>
      </div>

      {/* Rules summary card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-card)',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} color="#fbbf24" />
          <span>Visszaszámláló</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={16} color="#ec4899" />
          <span>Színkódolt válaszok</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={16} color="#34d399" />
          <span>Top 5 ranglista</span>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleStart}
        disabled={loading}
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
      >
        <Play size={20} fill="currentColor" />
        {loading ? 'Kérdések betöltése...' : 'Játék indítása'}
      </button>
    </div>
  );
}
