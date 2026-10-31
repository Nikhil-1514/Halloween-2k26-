import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

const ALL_SYMBOLS = ['🎃', '👻', '🦇', '💀', '🕷️', '🧟', '⚰️', '🔮', '🕯️', '🧛'];

export default function MemoryDead({ onDone }) {
  const [shown, setShown] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);
  const [result, setResult] = useState(null);
  const sound = useSound();

  useEffect(() => {
    // pick 4 random symbols to show
    const shuffled = [...ALL_SYMBOLS].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 4);
    setShown(picked);
    // choose 1 as the target to remember
    const t = picked[Math.floor(Math.random() * picked.length)];
    setTarget(t);
    // create options: the target + 3 distractors
    const distractors = shuffled.filter(s => s !== t).slice(0, 3);
    const opts = [t, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(opts);
    // hide after 2 seconds
    const timer = setTimeout(() => setHidden(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handlePick = (sym) => {
    if (result) return;
    if (sym === target) { setResult('win'); sound.success(); }
    else { setResult('fail'); sound.failure(); }
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🧠 MEMORY OF THE DEAD</h3>
      {!hidden && (
        <div>
          <p className="screen-body">Remember these symbols…</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '2.5rem', margin: '1.5rem 0' }}>
            {shown.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </div>
      )}
      {hidden && !result && (
        <div>
          <p className="screen-body">Which one was shown?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            {options.map((s, i) => (
              <button key={i} onClick={() => handlePick(s)}
                style={{ fontSize: '2.2rem', background: 'rgba(124,58,237,0.12)', border: '2px solid var(--clr-purple)', borderRadius: '12px', padding: '0.8rem 1.2rem', cursor: 'pointer' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      {result === 'win' && <p className="screen-body glow-text">The dead are impressed. 💀</p>}
      {result === 'fail' && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>Wrong memory… the dead remember everything.</p>}
      {result && <button className="btn btn--primary" onClick={() => onDone(result === 'win')} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
