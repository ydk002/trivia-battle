import React, { useState } from 'react';
import { X, Trophy, Medal, Trash2, Calendar, Award } from 'lucide-react';
import { getLeaderboard, clearLeaderboard } from '../utils/leaderboard';
import { soundFx } from '../utils/audio';

export default function LeaderboardModal({ isOpen, onClose }) {
  const [list, setList] = useState(() => getLeaderboard());

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm('Biztosan törölni szeretnéd a mentett pontszámokat?')) {
      clearLeaderboard();
      setList([]);
      soundFx.playClick();
    }
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
        return <span className="badge" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }}>Vegyes</span>;
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <span style={{ fontSize: '1.4rem' }}>🥇</span>;
    if (index === 1) return <span style={{ fontSize: '1.4rem' }}>🥈</span>;
    if (index === 2) return <span style={{ fontSize: '1.4rem' }}>🥉</span>;
    return <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', width: '24px', textAlign: 'center' }}>#{index + 1}</span>;
  };

  // Top 5 as requested by task specification
  const topScores = list.slice(0, 5);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Trophy size={24} color="#fbbf24" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Top 5 Ranglista</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Bezárás">
            <X size={18} />
          </button>
        </div>

        {topScores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
            <Award size={48} color="#64748b" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p>Még nincs mentett eredmény a toplistán.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Játssz egy kört és mentsd el a pontszámodat!</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {topScores.map((item, idx) => (
              <div key={item.id || idx} className={`leaderboard-item ${idx === 0 ? 'top-1' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {getRankIcon(idx)}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.98rem' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Calendar size={12} />
                      <span>{item.date || 'Ma'}</span>
                      {getDifficultyBadge(item.difficulty)}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.15rem', color: '#a5b4fc' }}>
                    {item.score} / {item.total}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {Math.round((item.score / item.total) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem' }}>
          {topScores.length > 0 && (
            <button
              onClick={handleClear}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', color: '#f87171' }}
            >
              <Trash2 size={15} />
              <span>Lista törlése</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-primary"
            style={{ marginLeft: 'auto', padding: '0.6rem 1.4rem', fontSize: '0.95rem' }}
          >
            Rendben
          </button>
        </div>
      </div>
    </div>
  );
}
