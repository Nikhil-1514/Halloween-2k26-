import { useState, useEffect, useRef } from 'react';
import { LEVEL5 } from '../levels/levelData';
import { audioManager } from '../utils/audio';
import './Level5.css';

/**
 * LEVEL 5 — THE FINAL NIGHTMARE
 * Standalone atmospheric scene — quiet, minimal, optional nightmare input
 */
const Level5 = ({ onComplete, onUpdatePlayer, player, soundEnabled }) => {
  const [step, setStep]       = useState(0);
  const [inputVal, setInput]  = useState('');
  const [exiting, setExiting] = useState(false);
  const [submitted, setSub]   = useState(false);
  const locked                = useRef(false);
  const timers                = useRef([]);

  const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    add(() => setStep(1), 800);
    add(() => setStep(2), 2200);
    add(() => setStep(3), 3600);
    add(() => setStep(4), 5000);
    add(() => setStep(5), 6200);
  }, []);

  const handleSubmit = (val) => {
    if (locked.current || submitted) return;
    locked.current = true;
    setSub(true);
    const nightmare = (val ?? inputVal).trim();
    if (nightmare) onUpdatePlayer({ nightmare });
    if (soundEnabled) audioManager.playSurvivor();
    setExiting(true);
    add(onComplete, 1200);
  };

  const handleSkip = () => handleSubmit('');

  return (
    <div className={`l5-scene ${exiting ? 'exiting' : ''}`}>
      <div className="l5-vignette" aria-hidden="true" />

      {step >= 1 && <p className="l5-tag">Level 05 — The Final Nightmare</p>}
      {step >= 2 && <h1 className="l5-title">{LEVEL5.title}</h1>}

      {step >= 3 && (
        <div className="l5-atmo">
          {LEVEL5.atmosphere.map((line, i) => (
            <p key={i} className="l5-line" style={{ animationDelay: `${i * 0.5}s` }}>
              {line}
            </p>
          ))}
        </div>
      )}

      {step >= 4 && (
        <div className="l5-input-block">
          <label className="field-label l5-label" htmlFor="nightmare-input">
            {LEVEL5.inputLabel}
            <span className="optional-tag"> — optional</span>
          </label>
          <textarea
            id="nightmare-input"
            className="textarea l5-textarea"
            value={inputVal}
            onChange={e => setInput(e.target.value)}
            placeholder={LEVEL5.placeholder}
            maxLength={LEVEL5.maxLength}
            rows={4}
            disabled={submitted}
            autoFocus
          />
        </div>
      )}

      {step >= 5 && !submitted && (
        <div className="l5-actions">
          <button id="l5-submit" className="btn btn-primary" onClick={() => handleSubmit()}>
            Submit
          </button>
          <button id="l5-skip" className="btn btn-ghost l5-skip" onClick={handleSkip}>
            Skip
          </button>
        </div>
      )}
    </div>
  );
};

export default Level5;
