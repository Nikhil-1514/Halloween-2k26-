import { useState, useEffect, useRef } from 'react';
import { LEVELS } from './levelData';
import { RISK_FLAVOR } from '../state/gameState';
import { validateName, validateAge } from '../utils/validation';
import { audioManager } from '../utils/audio';
import './LevelShell.css';

/**
 * Upgraded LevelShell — handles Levels 1, 2, 3 with two-phase collection
 * Phase 1: primary question (name/age/fear)
 * Phase 2: behavioral question (riskStyle/observationStyle/fearResponse)
 */
const LevelShell = ({
  levelNumber,
  onContinue,
  onGiveUp,
  onUpdatePlayer,
  player,
  soundEnabled,
}) => {
  const level = LEVELS[levelNumber];

  const [phase, setPhase]         = useState('intro');     // intro|atmo|phase1|phase2|result|decision
  const [atmoStep, setAtmo]       = useState(0);
  const [inputVal, setInput]      = useState('');
  const [fearCat, setFearCat]     = useState('');          // Level 3 fear category
  const [customFear, setCustom]   = useState('');          // Level 3 "other"
  const [choice2, setChoice2]     = useState(null);        // phase 2 behavioral choice
  const [choiceKey2, setKey2]     = useState(null);        // key for phase 2 (level 3 has 5)
  const [error, setError]         = useState('');
  const [exiting, setExiting]     = useState(false);
  const [submitting, setSubmit]   = useState(false);
  const locked                    = useRef(false);
  const timers                    = useRef([]);

  const add = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  // Reset on level change
  useEffect(() => {
    setPhase('intro');
    setAtmo(0);
    setInput('');
    setFearCat('');
    setCustom('');
    setChoice2(null);
    setKey2(null);
    setError('');
    setExiting(false);
    setSubmit(false);
    locked.current = false;
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [levelNumber]);

  // Intro → atmosphere
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = add(() => setPhase('atmo'), 1000);
    return () => clearTimeout(id);
  }, [phase]);

  // Step through atmosphere lines
  const atmosphereLines = level?.phase1?.atmosphere ?? [];
  useEffect(() => {
    if (phase !== 'atmo') return;
    if (atmoStep < atmosphereLines.length) {
      const id = add(() => setAtmo(s => s + 1), atmoStep === 0 ? 500 : 1300);
      return () => clearTimeout(id);
    } else {
      const id = add(() => setPhase('phase1'), 900);
      return () => clearTimeout(id);
    }
  }, [phase, atmoStep, atmosphereLines.length]);

  // ── Phase 1 submit ─────────────────────────────────────────
  const handlePhase1Submit = (e) => {
    e?.preventDefault();
    if (submitting || locked.current) return;

    let err = null;
    if (levelNumber === 1) err = validateName(inputVal);
    if (levelNumber === 2) err = validateAge(inputVal);
    if (levelNumber === 3) {
      // Fear picker: category must be selected
      if (!fearCat && !customFear.trim()) err = 'Please choose or describe your fear.';
      else if (fearCat === 'Other' && !customFear.trim()) err = 'Please describe your fear.';
    }
    if (err) { setError(err); return; }

    setError('');
    setSubmit(true);

    // Save phase 1 data
    if (levelNumber === 1) onUpdatePlayer({ name: inputVal.trim() });
    if (levelNumber === 2) onUpdatePlayer({ age: inputVal.trim() });
    if (levelNumber === 3) {
      const fearValue = fearCat === 'Other' ? customFear.trim() : fearCat;
      onUpdatePlayer({ fear: fearValue, fearCategory: fearCat });
    }

    if (levelNumber === 1 && soundEnabled) {
      // door open sound effect
      audioManager.playClick();
    }

    setExiting(true);
    add(() => {
      setExiting(false);
      setSubmit(false);
      setPhase('phase2');
    }, 700);
  };

  // ── Phase 2 submit ─────────────────────────────────────────
  const handlePhase2Submit = () => {
    if (!choice2 || submitting || locked.current) {
      setError('Please make a choice.');
      return;
    }
    setError('');
    setSubmit(true);

    if (levelNumber === 1) onUpdatePlayer({ riskStyle: choice2 });
    if (levelNumber === 2) onUpdatePlayer({ observationStyle: choice2 });
    if (levelNumber === 3) onUpdatePlayer({ fearResponse: choiceKey2 });

    if (soundEnabled) audioManager.playLevelComplete();

    setExiting(true);
    add(() => {
      setExiting(false);
      setSubmit(false);
      setPhase('result');
    }, 700);
  };

  const handleContinue = () => {
    if (locked.current) return;
    locked.current = true;
    if (soundEnabled) audioManager.playTransition();
    setExiting(true);
    add(onContinue, 800);
  };

  const handleGiveUp = () => {
    if (locked.current) return;
    locked.current = true;
    setExiting(true);
    add(() => onGiveUp(levelNumber), 700);
  };

  if (!level) return null;

  const p2 = level.phase2;
  const riskFlavor = levelNumber === 1 && choice2 ? RISK_FLAVOR[choice2] : null;

  return (
    <div className={`level-scene ${exiting ? 'exiting' : ''}`}>
      <div className="level-vignette" aria-hidden="true" />

      {/* Header — shown until result */}
      {['intro','atmo','phase1','phase2'].includes(phase) && (
        <div className="level-header">
          <p className="level-number">Level {level.number}</p>
          <h1 className="level-title">{level.title}</h1>
          <p className="level-subtitle">{level.subtitle}</p>
        </div>
      )}

      {/* Atmosphere */}
      {phase === 'atmo' && (
        <div className="level-atmosphere" aria-live="polite">
          {atmosphereLines.slice(0, atmoStep).map((line, i) => (
            <p key={`a${i}`} className="atmo-line">{line || '\u00A0'}</p>
          ))}
        </div>
      )}

      {/* ── PHASE 1 — Primary question ── */}
      {phase === 'phase1' && (
        <div className="level-input-block">
          <form className="level-form" onSubmit={handlePhase1Submit} noValidate>

            {/* Level 1 & 2: simple input */}
            {(levelNumber === 1 || levelNumber === 2) && (
              <div className="level-field">
                <label className="field-label" htmlFor="lvl-input">
                  {level.phase1.inputLabel}
                </label>
                <input
                  id="lvl-input"
                  type={level.phase1.inputType}
                  className="input"
                  value={inputVal}
                  onChange={e => { setInput(e.target.value); setError(''); }}
                  placeholder={level.phase1.placeholder}
                  maxLength={level.phase1.maxLength}
                  min={levelNumber === 2 ? 1 : undefined}
                  max={levelNumber === 2 ? 120 : undefined}
                  autoComplete="off"
                  autoFocus
                />
                {error && <span className="error-text" role="alert">{error}</span>}
              </div>
            )}

            {/* Level 3: Fear picker */}
            {levelNumber === 3 && (
              <div className="level-field">
                <p className="field-label" style={{ marginBottom: '1rem' }}>
                  What are you most afraid of?
                </p>
                <div className="fear-categories">
                  {level.phase1.categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`fear-cat-btn ${fearCat === cat ? 'selected' : ''}`}
                      onClick={() => { setFearCat(cat); setError(''); }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {fearCat === 'Other' && (
                  <div style={{ marginTop: '1rem' }}>
                    <textarea
                      className="textarea"
                      value={customFear}
                      onChange={e => { setCustom(e.target.value); setError(''); }}
                      placeholder="Describe what you're afraid of..."
                      rows={3}
                      maxLength={300}
                      autoFocus
                    />
                  </div>
                )}
                {error && <span className="error-text" role="alert">{error}</span>}
              </div>
            )}

            <button
              id="phase1-submit"
              type="submit"
              className="btn btn-primary level-submit"
              disabled={submitting}
            >
              {submitting ? '...' : 'Continue'}
            </button>
          </form>
        </div>
      )}

      {/* ── PHASE 2 — Behavioral question ── */}
      {phase === 'phase2' && (
        <div className="level-input-block">
          {/* Level 2 room scene */}
          {levelNumber === 2 && (
            <div className="room-scene">
              {level.phase2.roomItems.map((item, i) => (
                <div key={i} className="room-item">{item}</div>
              ))}
            </div>
          )}

          <div className="level-field">
            <p className="field-label" style={{ marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.5, letterSpacing: '0.05em', textTransform: 'none', color: 'var(--ash)' }}>
              {p2.prompt}
            </p>
            <div className="phase2-choices">
              {p2.choices.map(c => (
                <button
                  key={c.key}
                  type="button"
                  className={`level-choice-btn ${choiceKey2 === c.key ? 'selected' : ''}`}
                  onClick={() => {
                    setChoice2(c.value ?? c.key);
                    setKey2(c.key);
                    setError('');
                  }}
                  aria-pressed={choiceKey2 === c.key}
                >
                  <span className="choice-key">{c.key}</span>
                  <span className="choice-text">{c.label}</span>
                </button>
              ))}
            </div>
            {error && <span className="error-text" role="alert">{error}</span>}
          </div>

          <button
            id="phase2-submit"
            className="btn btn-primary level-submit"
            onClick={handlePhase2Submit}
            disabled={submitting || !choice2}
          >
            {submitting ? '...' : 'Submit'}
          </button>
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === 'result' && (
        <div className="level-result" aria-live="polite">
          <p className="result-message">{level.postMessage}</p>

          {riskFlavor && (
            <p className="result-flavor">{riskFlavor}</p>
          )}

          {/* Level 3 completion lines */}
          {levelNumber === 3 && level.completionLines && (
            <div className="completion-lines">
              {level.completionLines.filter(l => l !== '').map((line, i) => (
                <p key={i} className="completion-line" style={{ animationDelay: `${i * 0.4}s` }}>
                  {line}
                </p>
              ))}
            </div>
          )}

          <p className="result-spider-note">{level.spiderNote}</p>

          <div className="level-decision">
            <button
              id={`level-${levelNumber}-continue`}
              className="btn btn-primary"
              onClick={handleContinue}
              autoFocus
            >
              {levelNumber === 3 ? 'Enter Level 04' : 'Keep Going'}
            </button>
            <button
              id={`level-${levelNumber}-giveup`}
              className="btn btn-ghost level-giveup"
              onClick={handleGiveUp}
            >
              Give Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelShell;
