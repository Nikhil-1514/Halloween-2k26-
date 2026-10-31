import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../utils/audio';
import './TrickIntro.css';

/**
 * TRICK INTRO — "You chose trick"
 * Darkens the atmosphere, explains the stakes
 */
const TrickIntro = ({ onEnter, soundEnabled }) => {
  const [step, setStep]       = useState(0);
  const [exiting, setExiting] = useState(false);
  const locked                = useRef(false);
  const timers                = useRef([]);

  const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => {
    add(() => setStep(1), 600);
    add(() => setStep(2), 2000);
    add(() => setStep(3), 3500);
    add(() => setStep(4), 5000);
    add(() => setStep(5), 6200);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    if (locked.current) return;
    locked.current = true;
    if (soundEnabled) {
      audioManager.playWarning();
    }
    setExiting(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <div className={`trick-intro-scene ${exiting ? 'exiting' : ''}`}>
      <div className="trick-vignette" aria-hidden="true" />

      <div className="trick-content">
        {step >= 1 && (
          <h1 className="trick-title">You Chose Trick</h1>
        )}
        {step >= 2 && (
          <div className="trick-rules">
            <p>Five levels.</p>
            <p>Five decisions.</p>
            <p>You may leave at any time.</p>
            <p>But every level changes your reward.</p>
          </div>
        )}
        {step >= 3 && (
          <div className="divider-ember" />
        )}
        {step >= 4 && (
          <p className="trick-warning">
            Once you enter, the challenge begins.
          </p>
        )}
        {step >= 5 && (
          <button
            id="trick-enter-btn"
            className="btn btn-danger trick-enter-btn"
            onClick={handleEnter}
            autoFocus
          >
            Enter the House
          </button>
        )}
      </div>
    </div>
  );
};

export default TrickIntro;
