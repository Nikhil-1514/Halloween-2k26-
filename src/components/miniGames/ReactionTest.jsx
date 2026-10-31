import React, { useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

export default function ReactionTest({ onDone }) {
  const [phase, setPhase] = useState('waiting'); // waiting | ready | result
  const [startTime, setStartTime] = useState(0);
  const [reaction, setReaction] = useState(null);
  const sound = useSound();

  useEffect(() => {
    const delay = 1000 + Math.random() * 2000; // 1-3s
    const timer = setTimeout(() => {
      setPhase('ready');
      setStartTime(performance.now());
      sound.creepy();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (phase !== 'ready') return;
    const rt = Math.round(performance.now() - startTime);
    setReaction(rt);
    setPhase('result');
    sound.success();
  };

  const handleContinue = () => {
    onDone && onDone(true);
  };

  return (
    <div className="mini-game reaction-test" onClick={handleClick} style={{ cursor: phase === 'ready' ? 'pointer' : 'default', textAlign: 'center', padding: '2rem' }}>
      {phase === 'waiting' && <p className="screen-body">DON'T BLINK.</p>}
      {phase === 'ready' && <button className="btn btn--primary">CLICK NOW!</button>}
      {phase === 'result' && (
        <div>
          <p className="screen-body">Your reaction: {reaction} ms</p>
          <p className="screen-body">{reaction < 300 ? 'THE GHOST IS IMPRESSED.' : 'THE GHOST IS UNIMPRESSED.'}</p>
          <button className="btn btn--primary" onClick={handleContinue}>Continue</button>
        </div>
      )}
    </div>
  );
}
