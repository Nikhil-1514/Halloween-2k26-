import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

export default function EscapeWeb({ onDone }) {
  const [points, setPoints] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [timeLeft, setTimeLeft] = useState(6);
  const [result, setResult] = useState(null);
  const sound = useSound();
  const total = 4;

  useEffect(() => {
    const pts = Array.from({ length: total }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 65,
      y: 15 + Math.random() * 65,
    }));
    setPoints(pts);
  }, []);

  useEffect(() => {
    if (result) return;
    if (timeLeft <= 0) { setResult('fail'); sound.failure(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result]);

  const handleClick = (id) => {
    if (result) return;
    const next = [...clicked, id];
    setClicked(next);
    sound.click();
    if (next.length >= total) { setResult('win'); sound.success(); }
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem', position: 'relative', minHeight: '350px' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🕸️ ESCAPE THE WEB</h3>
      {!result && <p className="screen-body">Click all escape points! ({timeLeft}s)</p>}
      {points.map(p => !clicked.includes(p.id) && (
        <button key={p.id} onClick={() => handleClick(p.id)}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontSize: '1.8rem', background: 'rgba(57,255,20,0.2)', border: '2px solid var(--clr-green)', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', boxShadow: 'var(--glow-green)' }}>
          ✨
        </button>
      ))}
      {result === 'win' && <p className="screen-body glow-text">You escaped the web!</p>}
      {result === 'fail' && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>The web consumed you… 🕸️</p>}
      {result && <button className="btn btn--primary" onClick={() => onDone(result === 'win')} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
