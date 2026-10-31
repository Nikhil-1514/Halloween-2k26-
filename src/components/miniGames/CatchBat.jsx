import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';

export default function CatchBat({ onDone }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);
  const sound = useSound();
  const needed = 3;

  useEffect(() => {
    if (done) return;
    const iv = setInterval(() => {
      setPos({ x: 10 + Math.random() * 70, y: 10 + Math.random() * 70 });
    }, 900);
    return () => clearInterval(iv);
  }, [done]);

  const handleHit = () => {
    if (done) return;
    const next = hits + 1;
    setHits(next);
    sound.click();
    setPos({ x: 10 + Math.random() * 70, y: 10 + Math.random() * 70 });
    if (next >= needed) {
      setDone(true);
      sound.success();
    }
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem', position: 'relative', minHeight: '350px' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🦇 CATCH THE BAT</h3>
      <p className="screen-body">Tap the bat {needed} times! ({hits}/{needed})</p>
      {!done && (
        <button onClick={handleHit}
          style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, fontSize: '2.5rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'left 0.2s, top 0.2s', transform: 'translate(-50%, -50%)' }}>
          🦇
        </button>
      )}
      {done && (
        <div>
          <p className="screen-body glow-text">You caught the bat!</p>
          <button className="btn btn--primary" onClick={() => onDone(true)} style={{ marginTop: '1rem' }}>Continue</button>
        </div>
      )}
    </div>
  );
}
