import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

export default function SpiderDodge({ onDone }) {
  const [spiders, setSpiders] = useState([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [done, setDone] = useState(false);
  const sound = useSound();

  // Spawn spiders periodically
  useEffect(() => {
    if (done) return;
    const iv = setInterval(() => {
      const isCursed = Math.random() < 0.3;
      const newSpider = {
        id: Date.now() + Math.random(),
        x: 10 + Math.random() * 75,
        y: 10 + Math.random() * 60,
        cursed: isCursed,
      };
      setSpiders(prev => [...prev.slice(-6), newSpider]);
    }, 800);
    return () => clearInterval(iv);
  }, [done]);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) { setDone(true); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  const handleClick = (spider) => {
    if (done) return;
    if (spider.cursed) {
      setMistakes(m => m + 1);
      sound.failure();
      if (mistakes + 1 >= 3) setDone(true);
    } else {
      setScore(s => s + 1);
      sound.click();
    }
    setSpiders(prev => prev.filter(s => s.id !== spider.id));
  };

  const won = mistakes < 3;

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem', position: 'relative', minHeight: '350px' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🕷️ SPIDER DODGE</h3>
      {!done && <p className="screen-body">Collect safe spiders 🕷️ — avoid cursed ones! ❌ ({timeLeft}s) Mistakes: {mistakes}/3</p>}
      {!done && spiders.map(s => (
        <button key={s.id} onClick={() => handleClick(s)}
          style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', transform: 'translate(-50%, -50%)', filter: s.cursed ? 'hue-rotate(120deg) brightness(1.5)' : 'none' }}>
          🕷️
        </button>
      ))}
      {done && won && <p className="screen-body glow-text">You collected {score} safe spiders!</p>}
      {done && !won && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>The cursed spiders got you! 💀</p>}
      {done && <button className="btn btn--primary" onClick={() => onDone(won)} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
