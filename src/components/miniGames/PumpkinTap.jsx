import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

export default function PumpkinTap({ onDone }) {
  const [pumpkins, setPumpkins] = useState([]);
  const [cursedIdx, setCursedIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const sound = useSound();

  useEffect(() => {
    const count = 6;
    const cursed = Math.floor(Math.random() * count);
    setCursedIdx(cursed);
    setPumpkins(Array.from({ length: count }, (_, i) => ({ id: i, clicked: false })));
  }, []);

  useEffect(() => {
    if (result) return;
    if (timeLeft <= 0) { setResult('timeout'); sound.failure(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result]);

  const handleTap = (idx) => {
    if (result) return;
    if (idx === cursedIdx) {
      setResult('win');
      sound.success();
    } else {
      setPumpkins(p => p.map((pk, i) => i === idx ? { ...pk, clicked: true } : pk));
      sound.click();
    }
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🎃 PUMPKIN TAP</h3>
      {!result && <p className="screen-body">Find the cursed pumpkin! ({timeLeft}s)</p>}
      {!result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '300px', margin: '1.5rem auto' }}>
          {pumpkins.map((p) => (
            <button key={p.id} onClick={() => handleTap(p.id)}
              style={{ fontSize: '2.5rem', background: p.clicked ? 'rgba(139,26,26,0.4)' : 'rgba(255,107,0,0.15)', border: '2px solid var(--clr-orange)', borderRadius: '12px', padding: '1rem', cursor: 'pointer', opacity: p.clicked ? 0.4 : 1 }}
              disabled={p.clicked}>
              {p.clicked ? '💀' : '🎃'}
            </button>
          ))}
        </div>
      )}
      {result === 'win' && <p className="screen-body glow-text">You found the cursed one!</p>}
      {result === 'timeout' && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>Too slow… the pumpkin escaped.</p>}
      {result && <button className="btn btn--primary" onClick={() => onDone(result === 'win')} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
