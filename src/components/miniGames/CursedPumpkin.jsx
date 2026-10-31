import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

export default function CursedPumpkin({ onDone }) {
  const [phase, setPhase] = useState('waiting'); // waiting | shaking | result
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [sweetSpot, setSweetSpot] = useState(0);
  const [result, setResult] = useState(null);
  const sound = useSound();

  useEffect(() => {
    // Pumpkin starts shaking after random delay, peak between 50-80%
    const peak = 50 + Math.random() * 30;
    setSweetSpot(peak);
    const startDelay = 500 + Math.random() * 1000;
    const t1 = setTimeout(() => {
      setPhase('shaking');
      let intensity = 0;
      const iv = setInterval(() => {
        intensity += 2;
        setShakeIntensity(intensity);
        if (intensity >= 100) {
          clearInterval(iv);
          setResult('late');
          setPhase('result');
          sound.failure();
        }
      }, 80);
      // store interval ref for cleanup
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t1);
  }, []);

  const handleClick = () => {
    if (phase !== 'shaking' || result) return;
    const diff = Math.abs(shakeIntensity - sweetSpot);
    if (diff < 15) {
      setResult('perfect');
      sound.success();
    } else if (diff < 30) {
      setResult('early');
      sound.click();
    } else {
      setResult('early');
      sound.failure();
    }
    setPhase('result');
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🎃 CURSED PUMPKIN</h3>
      {phase === 'waiting' && <p className="screen-body">The pumpkin is stirring…</p>}
      {phase === 'shaking' && <p className="screen-body">Click at the right moment!</p>}
      <div onClick={handleClick}
        style={{ fontSize: '5rem', margin: '2rem 0', cursor: phase === 'shaking' ? 'pointer' : 'default', display: 'inline-block', animation: phase === 'shaking' ? `twitch ${Math.max(0.05, 0.3 - shakeIntensity * 0.002)}s infinite` : 'none' }}>
        🎃
      </div>
      {result === 'perfect' && <p className="screen-body glow-text">PERFECT TIMING! The pumpkin is yours. 🎃</p>}
      {result === 'early' && <p className="screen-body" style={{ color: 'var(--clr-orange-lt)' }}>Too soon… but close.</p>}
      {result === 'late' && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>The pumpkin escaped. 💨</p>}
      {result && <button className="btn btn--primary" onClick={() => onDone(result === 'perfect')} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
