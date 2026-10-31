import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

const surprises = [
  { safe: true, msg: "A friendly cat. 🐱 You're safe." },
  { safe: false, msg: "A SKELETON HAND REACHES OUT! 💀" },
  { safe: false, msg: "BATS FLY OUT OF THE GRAVE! 🦇" },
];

export default function GraveyardGuess({ onDone }) {
  const [safeGrave] = useState(() => Math.floor(Math.random() * 3));
  const [chosen, setChosen] = useState(null);
  const sound = useSound();

  const handleDig = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    idx === safeGrave ? sound.success() : sound.failure();
  };

  const isSafe = chosen === safeGrave;

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>⚰️ GRAVEYARD GUESS</h3>
      {chosen === null && <p className="screen-body">Choose a grave to dig up…</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1.5rem auto', maxWidth: '320px' }}>
        {[0, 1, 2].map(i => (
          <button key={i} onClick={() => handleDig(i)} disabled={chosen !== null}
            style={{ fontSize: '3rem', padding: '1.5rem 1rem', background: chosen === i ? (i === safeGrave ? 'rgba(57,255,20,0.15)' : 'rgba(139,26,26,0.3)') : 'rgba(124,58,237,0.12)', border: '2px solid var(--clr-purple)', borderRadius: '12px', cursor: chosen !== null ? 'default' : 'pointer', flex: 1 }}>
            ⚰️
          </button>
        ))}
      </div>
      {chosen !== null && (
        <div>
          <p className="screen-body" style={{ color: isSafe ? 'var(--clr-green)' : 'var(--clr-red)' }}>
            {isSafe ? surprises[0].msg : (chosen === 0 ? surprises[1].msg : surprises[2].msg)}
          </p>
          <button className="btn btn--primary" onClick={() => onDone(isSafe)} style={{ marginTop: '1rem' }}>Continue</button>
        </div>
      )}
    </div>
  );
}
