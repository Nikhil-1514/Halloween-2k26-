import { useState, useEffect, useRef } from 'react';
import { CASES, CHARACTERS } from './levelData';
import { audioManager } from '../utils/audio';
import './Level4Arcade.css';

/**
 * LEVEL 4 — THE NIGHT SHIFT
 * 7 character selection + 3 cases × 4 decisions = 12 total
 * 3 lives system, evidence panel, per-decision story
 */
const Level4Arcade = ({
  arcade,
  player,
  soundEnabled,
  onUpdateArcade,
  onUpdatePlayer,
  onComplete,
  onFail,
  onGiveUp,
}) => {
  const [subPhase, setSubPhase] = useState('opening');  // opening|character|case-intro|decision|outcome|case-done|failed|complete
  const [selectedChar, setChar] = useState(player.character || null);
  const [selectedChoice, setChoice] = useState(null);
  const [selectedSurvivalChoice, setSurvivalChoice] = useState(null);
  const [outcomeData, setOutcome] = useState(null);
  const [survivalResult, setSurvivalResult] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [atmoStep, setAtmo] = useState(0);
  const [exiting, setExiting] = useState(false);
  const locked = useRef(false);
  const timers = useRef([]);

  const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (subPhase === 'survival-outcome') locked.current = false;
  }, [subPhase]);

  // Derive current case + decision
  const caseIdx = arcade.currentCase;
  const decIdx  = arcade.currentDecision;
  const currentCase = CASES[caseIdx];
  const currentDecision = currentCase?.decisions[decIdx];
  const lives = arcade.lives;
  const totalDecisions = CASES.reduce((s, c) => s + c.decisions.length, 0);
  const caseDecisionOffset = CASES.slice(0, caseIdx).reduce((s, c) => s + c.decisions.length, 0);
  const doneDecisions = caseDecisionOffset + (subPhase === 'case-done'
    ? currentCase?.decisions.length ?? 0
    : decIdx + 1);

  // Opening atmosphere
  const openingLines = [
    'Three cases.',
    'Three lives.',
    'Twelve decisions.',
    'You may survive the night.',
  ];

  useEffect(() => {
    if (subPhase !== 'opening') return;
    if (atmoStep < openingLines.length) {
      const id = add(() => setAtmo(s => s + 1), atmoStep === 0 ? 600 : 1200);
      return () => clearTimeout(id);
    } else {
      const id = add(() => setSubPhase('character'), 1000);
      return () => clearTimeout(id);
    }
  }, [subPhase, atmoStep]);

  // Case intro step
  const [caseIntroStep, setCaseIntroStep] = useState(0);
  const caseLines = currentCase?.opening ?? [];

  useEffect(() => {
    if (subPhase !== 'case-intro') return;
    setCaseIntroStep(0);
  }, [subPhase, caseIdx]);

  useEffect(() => {
    if (subPhase !== 'case-intro') return;
    if (caseIntroStep < caseLines.length) {
      const id = add(() => setCaseIntroStep(s => s + 1), caseIntroStep === 0 ? 500 : 1100);
      return () => clearTimeout(id);
    } else {
      const id = add(() => setSubPhase('decision'), 900);
      return () => clearTimeout(id);
    }
  }, [subPhase, caseIntroStep, caseLines.length]);

  const handleSelectChar = (id) => {
    if (locked.current) return;
    setChar(id);
  };

  const handleEnterCases = () => {
    if (!selectedChar || locked.current) return;
    locked.current = true;
    onUpdatePlayer({ character: selectedChar });
    setExiting(true);
    add(() => {
      setExiting(false);
      locked.current = false;
      setSubPhase('case-intro');
    }, 700);
  };

  const handleChoiceSelect = (key) => {
    if (locked.current || subPhase !== 'decision') return;
    setChoice(key);
  };

  const handleSubmitDecision = () => {
    if (!selectedChoice || locked.current) return;
    locked.current = true;
    setChoice(null);

    const isCorrect = selectedChoice === currentDecision.correct;
    const newEvidence = isCorrect && currentDecision.evidence
      ? [...arcade.evidence, currentDecision.evidence]
      : arcade.evidence;

    if (soundEnabled) {
      if (isCorrect) audioManager.playLevelComplete();
      else           audioManager.playWarning();
    }

    setOutcome({
      correct:  isCorrect,
      text:     isCorrect ? currentDecision.correctText : currentDecision.wrongText,
      evidence: isCorrect ? currentDecision.evidence : null,
    });

    onUpdateArcade({ evidence: newEvidence });
    onUpdatePlayer({
      level4Decisions: [
        ...(player.level4Decisions ?? []),
        {
          caseId: currentCase.id,
          decisionId: currentDecision.id,
          choice: selectedChoice,
          correct: isCorrect,
        },
      ],
    });

    setSubPhase('outcome');
    add(() => {
      // Advance to next decision or next case
      const nextDecIdx = decIdx + 1;
      if (nextDecIdx >= currentCase.decisions.length) {
        // Case complete
        const newCaseResults = [...arcade.caseResults, { caseId: currentCase.id, solved: true }];
        onUpdateArcade({ currentDecision: currentCase.decisions.length - 1, caseResults: newCaseResults });
        setSubPhase('case-done');
      } else {
        onUpdateArcade({ currentDecision: nextDecIdx });
        setSubPhase('decision');
      }
      locked.current = false;
    }, 3500);
  };

  const handleBeginSurvival = () => {
    if (locked.current) return;
    setSurvivalChoice(null);
    setSubPhase('survival');
  };

  const handleSurvivalChoice = (choice) => {
    if (locked.current || subPhase !== 'survival' || !choice) return;
    locked.current = true;
    const newLives = Math.max(0, lives - (choice.costsLife ? 1 : 0));
    const events = [...(arcade.survivalEvents ?? []), {
      caseId: currentCase.id,
      survived: !choice.costsLife,
    }];
    onUpdateArcade({ lives: newLives, survivalEvents: events });
    setSurvivalResult({ ...choice, livesAfter: newLives });
    setSubPhase('survival-outcome');
  };

  const handleAfterSurvival = () => {
    if (locked.current) return;
    locked.current = true;
    if (survivalResult?.livesAfter <= 0) {
      setSubPhase('failed');
      locked.current = false;
      return;
    }

    const nextCase = caseIdx + 1;
    if (nextCase >= CASES.length) {
      if (soundEnabled) audioManager.playSurvivor();
      setExiting(true);
      add(() => { setExiting(false); setSubPhase('complete'); locked.current = false; }, 700);
      return;
    }

    onUpdateArcade({ currentCase: nextCase, currentDecision: 0 });
    setExiting(true);
    add(() => { setExiting(false); setSubPhase('case-intro'); locked.current = false; }, 700);
  };

  const handleRetry = () => {
    locked.current = false;
    onUpdateArcade({ lives: 3, currentCase: 0, currentDecision: 0, evidence: [], caseResults: [], survivalEvents: [], failed: false });
    onUpdatePlayer({ level4Decisions: [] });
    setSubPhase('case-intro');
    setOutcome(null);
    setChoice(null);
    setSurvivalChoice(null);
    setSurvivalResult(null);
  };

  const handleComplete = () => {
    if (locked.current) return;
    locked.current = true;
    setExiting(true);
    add(onComplete, 800);
  };

  const charObj = CHARACTERS.find(c => c.id === selectedChar);

  // Character-specific hint for current decision
  const charHint = currentDecision?.hint?.[selectedChar] ?? null;

  return (
    <div className={`arcade-scene ${exiting ? 'exiting' : ''}`}>
      <div className="arcade-vignette" aria-hidden="true" />

      {/* ── Opening atmosphere ── */}
      {subPhase === 'opening' && (
        <div className="arcade-opening">
          <p className="arcade-level-tag">Level 04</p>
          <h1 className="arcade-title">The Night Shift</h1>
          <div className="arcade-atmo">
            {openingLines.slice(0, atmoStep).map((l, i) => (
              <p key={i} className="arcade-atmo-line">{l}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── Character selection ── */}
      {subPhase === 'character' && (
        <div className="arcade-char-select">
          <p className="arcade-level-tag">Level 04 — The Night Shift</p>
          <h2 className="arcade-char-title">Who Are You Tonight?</h2>
          <div className="char-grid">
            {CHARACTERS.map(c => (
              <button
                key={c.id}
                className={`char-btn ${selectedChar === c.id ? 'selected' : ''}`}
                onClick={() => handleSelectChar(c.id)}
                aria-pressed={selectedChar === c.id}
              >
                <span className="char-icon">{c.icon}</span>
                <span className="char-label">{c.label}</span>
                {selectedChar === c.id && (
                  <span className="char-hint">{c.hint}</span>
                )}
              </button>
            ))}
          </div>
          <button
            id="char-enter-btn"
            className="btn btn-primary arcade-enter"
            onClick={handleEnterCases}
            disabled={!selectedChar}
          >
            Enter the Night Shift
          </button>
        </div>
      )}

      {/* ── HUD (shown during decision phases) ── */}
      {['case-intro','decision','outcome','case-done'].includes(subPhase) && (
        <div className="arcade-hud">
          <div className="hud-left">
            <span className="hud-tag">CASE {String(caseIdx + 1).padStart(2,'0')} / 03</span>
              <span className="hud-tag">DECISION {String(doneDecisions).padStart(2,'0')} / {String(totalDecisions).padStart(2,'0')}</span>
          </div>
          <div className="hud-center">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`hud-life ${i < lives ? 'alive' : 'lost'}`}>♥</span>
            ))}
          </div>
          <div className="hud-right">
            <button
              className="hud-evidence-btn"
              onClick={() => setShowEvidence(v => !v)}
              title="Evidence"
            >
              📋 {arcade.evidence.length}
            </button>
          </div>
        </div>
      )}

      {/* ── Evidence panel ── */}
      {showEvidence && (
        <div className="evidence-panel" role="dialog" aria-label="Evidence">
          <div className="evidence-header">
            <p className="evidence-title">Evidence</p>
            <button className="evidence-close" onClick={() => setShowEvidence(false)}>✕</button>
          </div>
          {arcade.evidence.length === 0 ? (
            <p className="evidence-empty">No evidence collected yet.</p>
          ) : (
            arcade.evidence.map(ev => (
              <div key={ev.id} className="evidence-item">
                <p className="evidence-label">{ev.label}</p>
                <p className="evidence-detail">{ev.detail}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Case intro ── */}
      {subPhase === 'case-intro' && currentCase && (
        <div className="arcade-case-intro">
          <p className="arcade-level-tag">CASE {currentCase.number} — {currentCase.theme}</p>
          <h2 className="arcade-case-title">{currentCase.title}</h2>
          <div className="arcade-atmo">
            {caseLines.slice(0, caseIntroStep).map((l, i) => (
              <p key={i} className={`arcade-atmo-line ${l === '' ? 'atmo-gap' : ''}`}>{l || '\u00A0'}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── Decision ── */}
      {subPhase === 'decision' && currentDecision && (
        <div className="arcade-decision">
          <div className="decision-story">
            {currentDecision.story.split('\n\n').map((p, i) => (
              <p key={i} className="story-para">{p}</p>
            ))}
          </div>

          {charHint && (
            <div className="char-hint-banner">
              <span className="char-hint-icon">{charObj?.icon}</span>
              <span className="char-hint-text">{charHint}</span>
            </div>
          )}

          <div className="decision-question">
            <p className="decision-q-label">{currentDecision.question}</p>
            <div className="decision-choices">
              {currentDecision.choices.map(c => (
                <button
                  key={c.key}
                  className={`dec-choice-btn ${selectedChoice === c.key ? 'selected' : ''}`}
                  onClick={() => handleChoiceSelect(c.key)}
                  aria-pressed={selectedChoice === c.key}
                >
                  <span className="choice-key">{c.key}</span>
                  <span className="choice-text">{c.label}</span>
                </button>
              ))}
            </div>

            <button
              id="decision-submit"
              className="btn btn-primary dec-submit"
              onClick={handleSubmitDecision}
              disabled={!selectedChoice}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* ── Outcome ── */}
      {subPhase === 'outcome' && outcomeData && (
        <div className={`arcade-outcome ${outcomeData.correct ? 'outcome-correct' : 'outcome-wrong'}`}>
          <p className="outcome-verdict">
            {outcomeData.correct ? '✓  Correct' : '✗  Decision Failed'}
          </p>
          {outcomeData.text.split('\n\n').map((p, i) => (
            <p key={i} className="outcome-text">{p}</p>
          ))}
          {outcomeData.evidence && (
            <div className="outcome-evidence">
              <p className="oe-label">Evidence Found</p>
              <p className="oe-name">{outcomeData.evidence.label}</p>
              <p className="oe-detail">{outcomeData.evidence.detail}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Case complete ── */}
      {subPhase === 'case-done' && currentCase && (
        <div className="arcade-case-done">
          {currentCase.completionText.split('\n\n').map((p, i) => (
            <p key={i} className={i === 0 ? 'case-done-title' : 'case-done-sub'}>{p}</p>
          ))}
          <button
            id="next-case-btn"
            className="btn btn-primary"
            onClick={handleBeginSurvival}
            autoFocus
          >
            Face the Survival Event
          </button>
          <button className="btn btn-ghost give-up-btn" onClick={onGiveUp}>
            Give Up
          </button>
        </div>
      )}

      {subPhase === 'survival' && currentCase?.survival && (
        <div className="arcade-decision arcade-survival">
          <p className="arcade-level-tag">SURVIVAL EVENT — CASE {currentCase.number}</p>
          <h2 className="arcade-case-title">One Move Left</h2>
          <p className="decision-q-label">{currentCase.survival.prompt}</p>
          <div className="decision-choices">
            {currentCase.survival.choices.map(choice => (
              <button
                key={choice.key}
                className={`dec-choice-btn ${selectedSurvivalChoice?.key === choice.key ? 'selected' : ''}`}
                onClick={() => setSurvivalChoice(choice)}
                aria-pressed={selectedSurvivalChoice?.key === choice.key}
              >
                <span className="choice-key">{choice.key}</span>
                <span className="choice-text">{choice.label}</span>
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary dec-submit"
            onClick={() => handleSurvivalChoice(selectedSurvivalChoice)}
            disabled={!selectedSurvivalChoice}
          >
            Make Your Move
          </button>
        </div>
      )}

      {subPhase === 'survival-outcome' && survivalResult && (
        <div className="arcade-outcome">
          <p className="outcome-verdict">
            {survivalResult.costsLife ? '✗  Survival Event' : '✓  You Stayed Safe'}
          </p>
          <p className="outcome-text">{survivalResult.result}</p>
          <p className="outcome-lives">
            {survivalResult.livesAfter} {survivalResult.livesAfter === 1 ? 'life' : 'lives'} remaining.
          </p>
          <button className="btn btn-primary" onClick={handleAfterSurvival}>
            {survivalResult.livesAfter <= 0
              ? 'Continue'
              : caseIdx + 1 >= CASES.length ? 'The Night Ends' : `Enter Case ${String(caseIdx + 2).padStart(2, '0')}`}
          </button>
        </div>
      )}

      {/* ── Failed ── */}
      {subPhase === 'failed' && (
        <div className="arcade-failed">
          <p className="failed-title">Night Shift Failed</p>
          <p className="failed-sub">You ran out of time to understand the night.</p>
          <div className="failed-actions">
            <button id="retry-btn" className="btn btn-primary" onClick={handleRetry}>Try Again</button>
            <button className="btn btn-ghost" onClick={onGiveUp}>Give Up</button>
          </div>
        </div>
      )}

      {/* ── All cases complete ── */}
      {subPhase === 'complete' && (
        <div className="arcade-complete">
          <p className="arcade-level-tag">3 / 3 CASES SOLVED</p>
          <h2 className="arcade-complete-title">You Survived the Night.</h2>
          <div className="arcade-stats">
            <div className="stat-row"><span>Cases</span><span>3 / 3</span></div>
            <div className="stat-row"><span>Decisions</span><span>12 / 12</span></div>
            <div className="stat-row"><span>Lives</span><span>{lives} / 3</span></div>
            <div className="stat-row"><span>Evidence</span><span>{arcade.evidence.length}</span></div>
          </div>
          <p className="arcade-complete-sub">The spider appears. It stops. Looks toward you. Disappears.</p>
          <button
            id="arcade-complete-btn"
            className="btn btn-primary"
            onClick={handleComplete}
            autoFocus
          >
            Level 05 Unlocked
          </button>
        </div>
      )}
    </div>
  );
};

export default Level4Arcade;
