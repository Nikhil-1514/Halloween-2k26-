import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

const doorResults = [
  { safe: false, msg: "A GHOST SCREAMS AT YOU! 👻" },
  { safe: false, msg: "SPIDERS EVERYWHERE! 🕷️" },
  { safe: true, msg: "You found the safe room. 🕯️" },
];

export default function HauntedDoor({ onDone }) {
  const [safeDoor] = useState(() => Math.floor(Math.random() * 3));
  const [chosen, setChosen] = useState(null);
  const sound = useSound();

  const handleDoor = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    if (idx === safeDoor) { sound.success(); } else { sound.failure(); }
  };

  const isSafe = chosen === safeDoor;

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🚪 HAUNTED DOOR</h3>
      {chosen === null && <p className="screen-body">Only one door is safe. Choose wisely.</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1.5rem auto', maxWidth: '320px' }}>
        {[0, 1, 2].map(i => (
          <button key={i} onClick={() => handleDoor(i)}
            disabled={chosen !== null}
            style={{ fontSize: '3rem', padding: '1.5rem 1rem', background: chosen === i ? (i === safeDoor ? 'rgba(57,255,20,0.15)' : 'rgba(139,26,26,0.3)') : 'rgba(124,58,237,0.12)', border: '2px solid var(--clr-purple)', borderRadius: '12px', cursor: chosen !== null ? 'default' : 'pointer', flex: 1 }}>
            🚪
          </button>
        ))}
      </div>
      {chosen !== null && (
        <div>
          <p className="screen-body" style={{ color: isSafe ? 'var(--clr-green)' : 'var(--clr-red)' }}>
            {isSafe ? "You found the safe room. 🕯️" : (chosen < safeDoor ? "A GHOST SCREAMS AT YOU! 👻" : "SPIDERS EVERYWHERE! 🕷️")}
          </p>
          <button className="btn btn--primary" onClick={() => onDone(isSafe)} style={{ marginTop: '1rem' }}>Continue</button>
        </div>
      )}
    </div>
  );
}
