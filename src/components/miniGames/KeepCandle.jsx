import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

export default function KeepCandle({ onDone }) {
  const [flame, setFlame] = useState(100);
  const [won, setWon] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const sound = useSound();
  const goal = 8; // survive 8 seconds

  useEffect(() => {
    if (won !== null) return;
    const iv = setInterval(() => {
      setFlame(f => {
        const next = f - 4;
        if (next <= 0) { setWon(false); sound.failure(); return 0; }
        return next;
      });
      setElapsed(e => {
        const next = e + 0.2;
        if (next >= goal) { setWon(true); sound.success(); }
        return next;
      });
    }, 200);
    return () => clearInterval(iv);
  }, [won]);

  const handleTap = () => {
    if (won !== null) return;
    setFlame(f => Math.min(100, f + 20));
    sound.click();
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🕯️ KEEP THE CANDLE ALIVE</h3>
      {won === null && <p className="screen-body">Tap the candle to keep it lit! ({Math.round(goal - elapsed)}s left)</p>}
      <div style={{ margin: '1.5rem auto', width: '80px', height: '120px', position: 'relative', cursor: 'pointer' }} onClick={handleTap}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '4rem' }}>🕯️</div>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: `${flame}%`, height: '20px', background: `linear-gradient(90deg, var(--clr-orange), var(--clr-moon))`, borderRadius: '10px', transition: 'width 0.2s', boxShadow: '0 0 10px rgba(255,107,0,0.6)' }} />
      </div>
      {won === true && <p className="screen-body glow-text">The darkness retreats…</p>}
      {won === false && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>The candle went out… 💀</p>}
      {won !== null && <button className="btn btn--primary" onClick={() => onDone(won)} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
