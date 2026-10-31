import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

const tricks = [
  { type: 'jumpscare', msg: '👻 BOO!', followUp: 'Just kidding. You survived.' },
  { type: 'message', msg: 'Something is behind you right now.', followUp: '…or is it? 👀' },
  { type: 'shake', msg: 'THE SCREEN IS UNSTABLE!', followUp: 'Phew. It stopped.' },
  { type: 'disappear', msg: 'Click the button to escape.', followUp: 'The button was never real.' },
  { type: 'reverse', msg: '!siht daer nac uoy fI', followUp: 'You passed the mirror test. 🪞' },
  { type: 'whisper', msg: '…did you hear that?', followUp: 'The whispers have stopped. For now.' },
  { type: 'choice', msg: 'LEFT or RIGHT?', followUp: 'Both led to the same place. 🌀' },
];

export default function MysteryTrick({ onDone }) {
  const [trick] = useState(() => tricks[Math.floor(Math.random() * tricks.length)]);
  const [phase, setPhase] = useState('show'); // show | followup
  const [shaking, setShaking] = useState(false);
  const sound = useSound();

  useEffect(() => {
    if (trick.type === 'jumpscare') sound.creepy();
    if (trick.type === 'shake') {
      setShaking(true);
      setTimeout(() => setShaking(false), 1500);
    }
    const t = setTimeout(() => {
      setPhase('followup');
      sound.success();
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem', animation: shaking ? 'twitch 0.1s infinite' : 'none' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>❓ MYSTERY TRICK</h3>
      {phase === 'show' && (
        <p className="screen-body flicker" style={{ fontSize: '1.5rem', margin: '2rem 0' }}>{trick.msg}</p>
      )}
      {phase === 'followup' && (
        <div>
          <p className="screen-body glow-text" style={{ fontSize: '1.1rem', margin: '1.5rem 0' }}>{trick.followUp}</p>
          <button className="btn btn--primary" onClick={() => onDone(true)} style={{ marginTop: '1rem' }}>Continue</button>
        </div>
      )}
    </div>
  );
}
