import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

const scenarios = [
  { text: "A zombie is behind you.", options: ['RUN 🏃', 'HIDE 🙈'], winChance: 0.5 },
  { text: "You hear footsteps approaching…", options: ['SCREAM 😱', 'STAY QUIET 🤫'], winChance: 0.5 },
  { text: "A shadow moves across the wall.", options: ['INVESTIGATE 🔦', 'PRETEND YOU SAW NOTHING 🫣'], winChance: 0.5 },
];

export default function ZombieChoice({ onDone }) {
  const [scenario] = useState(() => scenarios[Math.floor(Math.random() * scenarios.length)]);
  const [result, setResult] = useState(null);
  const [chosenIdx, setChosenIdx] = useState(null);
  const sound = useSound();

  const handleChoice = (idx) => {
    if (result) return;
    setChosenIdx(idx);
    const won = Math.random() < scenario.winChance;
    setResult(won ? 'win' : 'fail');
    won ? sound.success() : sound.failure();
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🧟 ZOMBIE CHOICE</h3>
      <p className="screen-body" style={{ fontSize: '1.2rem', margin: '1.5rem 0' }}>{scenario.text}</p>
      {!result && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          {scenario.options.map((opt, i) => (
            <button key={i} className="btn btn--primary" onClick={() => handleChoice(i)} style={{ fontSize: '1rem' }}>
              {opt}
            </button>
          ))}
        </div>
      )}
      {result === 'win' && <p className="screen-body glow-text">You chose wisely… this time. 🧟</p>}
      {result === 'fail' && <p className="screen-body" style={{ color: 'var(--clr-red)' }}>Bad choice. The zombie got you. 💀</p>}
      {result && <button className="btn btn--primary" onClick={() => onDone(result === 'win')} style={{ marginTop: '1rem' }}>Continue</button>}
    </div>
  );
}
