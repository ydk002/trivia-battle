import React from 'react';
import { Gamepad2, Trophy, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

export default function Navbar({ onOpenLeaderboard, isMuted, setIsMuted, onHome }) {
  const toggleAudio = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFx.playClick();
    }
  };

  return (
    <header className="navbar">
      <div className="brand" onClick={onHome} style={{ cursor: 'pointer' }} title="Vissza a főmenübe">
        <Gamepad2 size={32} color="#818cf8" />
        <span>Trivia Battle</span>
      </div>

      <div className="nav-actions">
        <button
          className="icon-btn"
          onClick={toggleAudio}
          title={isMuted ? 'Hang bekapcsolása' : 'Némítás'}
          aria-label="Hangkapcsoló"
        >
          {isMuted ? <VolumeX size={20} color="#f87171" /> : <Volume2 size={20} color="#34d399" />}
        </button>

        <button
          className="icon-btn"
          onClick={() => {
            soundFx.playClick();
            onOpenLeaderboard();
          }}
          title="Ranglista"
          aria-label="Ranglista megnyitása"
        >
          <Trophy size={20} color="#fbbf24" />
        </button>
      </div>
    </header>
  );
}
