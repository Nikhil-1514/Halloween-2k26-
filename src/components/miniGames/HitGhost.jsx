import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

export default function HitGhost({ onDone }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [done, setDone] = useState(false);
  const sound = useSound();
  const needed = 5;

  useEffect(() => {
    if (done) return;
    const iv = setInterval(() => {
      setPos({ x: 10 + Math.random() * 70, y: 15 + Math.random() * 60 });
    }, 700);
    return () => clearInterval(iv);
  }, [done]);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) { setDone(true); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  const handleHit = (e) => {
    e.stopPropagation();
    if (done) return;
    const next = score + 1;
    setScore(next);
    sound.click();
    setPos({ x: 10 + Math.random() * 70, y: 15 + Math.random() * 60 });
    if (next >= needed) { setDone(true); sound.success(); }
  };

  const won = score >= needed;

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem', position: 'relative', minHeight: '350px' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>👻 HIT THE GHOST</h3>
      {!done && <p className="screen-body">Hit the ghost {needed} times! ({score}/{needed}) — {timeLeft}s</p>}
      {!done && (
        <button onClick={handleHit}
          style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, fontSize: '3rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'left 0.15s, top 0.15s', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' }}>
          👻
        </button>
      )}
      {done && won && <p className="screen-body glow-text">The ghost has been vanquished!</p>}
      {done && !won && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>The ghost escaped… ({score}/{needed})</p>}
      {done && <button className="btn btn--primary" onClick={() => onDone(won)} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
