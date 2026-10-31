import { useState, useEffect, useRef } from 'react';
import './FinalGreeting.css';

/**
 * FINAL GREETING — Closing card from Nikhil after certificate
 * Warm Halloween close, then fade to black
 */
const FinalGreeting = ({ player, onExit }) => {
  const [step, setStep]       = useState(0);
  const [fading, setFading]   = useState(false);
  const [done, setDone]       = useState(false);
  const locked                = useRef(false);
  const timers                = useRef([]);

  const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    add(() => setStep(1), 600);
    add(() => setStep(2), 2000);
    add(() => setStep(3), 3400);
    add(() => setStep(4), 4800);
    add(() => setStep(5), 6000);
  }, []);

  const handleExit = () => {
    if (locked.current) return;
    locked.current = true;
    setFading(true);
    add(() => {
      setDone(true);
      add(() => onExit(), 2000);
    }, 1000);
  };

  const name = player?.name || null;

  return (
    <div className={`fg-scene ${fading ? 'fading' : ''}`}>
      {done && (
        <div className="fg-blackout">
          <p className="fg-blackout-text">See you next Halloween.</p>
        </div>
      )}

      {!done && (
        <>
          <div className="fg-glow" aria-hidden="true" />

          {step >= 1 && (
            <p className="fg-eyebrow">🎃 Happy Halloween 🎃</p>
          )}
          {step >= 2 && (
            <h1 className="fg-title">You Made It Through.</h1>
          )}
          {step >= 3 && (
            <div className="fg-message">
              {name ? <p>Well done, {name}.</p> : <p>Well done.</p>}
              <p>Thanks for playing Nikhil's Halloween Challenge.</p>
            </div>
          )}
          {step >= 4 && (
            <div className="fg-sig">— NIKHIL KOTIPATRUNI</div>
          )}
          {step >= 5 && (
            <button
              id="exit-night-btn"
              className="btn btn-ghost fg-exit"
              onClick={handleExit}
              autoFocus
            >
              Exit the Night
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FinalGreeting;
