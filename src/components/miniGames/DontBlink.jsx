import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

const eyeStates = ['👁️', '👁️‍🗨️', '🔴', '⚫'];

export default function DontBlink({ onDone }) {
  const [phase, setPhase] = useState('watching'); // watching | changed | result
  const [eyeEmoji, setEyeEmoji] = useState('👁️');
  const [startTime, setStartTime] = useState(0);
  const [reaction, setReaction] = useState(null);
  const sound = useSound();

  useEffect(() => {
    const delay = 2000 + Math.random() * 3000;
    const t = setTimeout(() => {
      const newEye = eyeStates[1 + Math.floor(Math.random() * (eyeStates.length - 1))];
      setEyeEmoji(newEye);
      setPhase('changed');
      setStartTime(performance.now());
      sound.creepy();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    if (phase === 'watching') return;
    if (phase === 'changed') {
      const rt = Math.round(performance.now() - startTime);
      setReaction(rt);
      setPhase('result');
      sound.success();
    }
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem', cursor: phase === 'changed' ? 'pointer' : 'default' }} onClick={handleClick}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>👁️ DON'T BLINK</h3>
      {phase === 'watching' && <p className="screen-body">Keep watching…</p>}
      <div style={{ fontSize: '5rem', margin: '2rem 0' }}>{eyeEmoji}</div>
      {phase === 'changed' && <p className="screen-body flicker">SOMETHING CHANGED! Click now!</p>}
      {phase === 'result' && (
        <div>
          <p className="screen-body">You noticed in {reaction}ms</p>
          <p className="screen-body">{reaction < 500 ? 'Sharp eyes… 👁️' : 'Almost missed it…'}</p>
          <button className="btn btn--primary" onClick={() => onDone(true)} style={{ marginTop: '1rem' }}>Continue</button>
        </div>
      )}
    </div>
  );
}
