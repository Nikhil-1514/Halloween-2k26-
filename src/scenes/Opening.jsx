import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../utils/audio';
import './Opening.css';

/**
 * SCENE 0 — BLACKOUT + OPENING SEQUENCE
 * Steps:
 *  0  → pure black
 *  1  → "October 31" fades in
 *  2  → "October 31" stays; "Something is waiting for you." fades in
 *  3  → shadow silhouette creeps in
 *  4  → "Are you sure you want to continue?" fades in
 *  5  → ENTER button appears
 */
const Opening = ({ onComplete, soundEnabled }) => {
  const [step, setStep]       = useState(0);
  const [exiting, setExiting] = useState(false);
  const locked                = useRef(false);
  const timers                = useRef([]);

  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    addTimer(() => setStep(1), 900);
    addTimer(() => setStep(2), 2800);
    addTimer(() => setStep(3), 4200);
    addTimer(() => setStep(4), 5600);
    addTimer(() => setStep(5), 7200);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    if (locked.current) return;
    locked.current = true;
    if (soundEnabled) {
      audioManager.playTransition();
      audioManager.startAmbience();
    }
    setExiting(true);
    setTimeout(onComplete, 1200);
  };

  return (
    <div className={`opening-scene ${exiting ? 'exiting' : ''}`} aria-label="Opening sequence">
      {/* Grain overlay */}
      <div className="opening-grain" aria-hidden="true" />

      {/* Fog layers */}
      <div className="fog-layer fog-1" aria-hidden="true" />
      <div className="fog-layer fog-2" aria-hidden="true" />

      {/* Shadow silhouette */}
      {step >= 3 && (
        <div className="opening-shadow" aria-hidden="true" />
      )}

      {/* Date */}
      {step >= 1 && (
        <p className={`opening-date ${step >= 1 ? 'visible' : ''}`}>
          October 31
        </p>
      )}

      {/* Main text block */}
      <div className="opening-center">
        {step >= 2 && (
          <p className="opening-waiting">
            Something is waiting for you.
          </p>
        )}

        {step >= 4 && (
          <p className="opening-question">
            Are you sure you want to continue?
          </p>
        )}

        {step >= 5 && (
          <button
            id="opening-enter-btn"
            className="btn btn-primary opening-enter"
            onClick={handleEnter}
            autoFocus
          >
            Enter
          </button>
        )}
      </div>
    </div>
  );
};

export default Opening;
