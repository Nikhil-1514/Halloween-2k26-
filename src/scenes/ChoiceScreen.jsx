import { useState, useRef } from 'react';
import { audioManager } from '../utils/audio';
import './ChoiceScreen.css';

/**
 * CHOICE SCREEN — Treat vs Trick
 * Reveals "YOUR CHOICES AWAIT" then the two path cards.
 */
const ChoiceScreen = ({ onChooseTreat, onChooseTrick, soundEnabled }) => {
  const [exiting, setExiting]   = useState(null); // 'treat' | 'trick'
  const [hovered, setHovered]   = useState(null);
  const locked                  = useRef(false);

  const pick = (choice) => {
    if (locked.current) return;
    locked.current = true;
    if (soundEnabled) {
      choice === 'treat' ? audioManager.playClick() : audioManager.playWarning();
    }
    setExiting(choice);
    setTimeout(() => {
      choice === 'treat' ? onChooseTreat() : onChooseTrick();
    }, 900);
  };

  return (
    <div className={`choice-scene ${exiting ? `exiting-${exiting}` : ''}`}>
      {/* Background fog */}
      <div className="choice-fog" aria-hidden="true" />

      {/* Header */}
      <div className="choice-header">
        <p className="choice-eyebrow">Tonight, you have two choices.</p>
        <h1 className="choice-title">Your Choices Await</h1>
        <div className="choice-divider" />
      </div>

      {/* Cards */}
      <div className="choice-cards" role="group" aria-label="Choose your path">

        {/* TREAT */}
        <button
          id="choice-treat-btn"
          className={`choice-card choice-treat ${hovered === 'treat' ? 'hovered' : ''}`}
          onClick={() => pick('treat')}
          onMouseEnter={() => setHovered('treat')}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered('treat')}
          onBlur={() => setHovered(null)}
          aria-label="Choose Treat — Give Nikhil a chocolate"
        >
          <span className="choice-icon" aria-hidden="true">🍫</span>
          <h2 className="choice-card-title">Treat</h2>
          <p className="choice-card-desc">Give Nikhil a chocolate.</p>
          <div className="choice-card-hint">The easy way out</div>
        </button>

        {/* Separator */}
        <div className="choice-separator" aria-hidden="true">
          <div className="sep-line" />
          <span className="sep-or">or</span>
          <div className="sep-line" />
        </div>

        {/* TRICK */}
        <button
          id="choice-trick-btn"
          className={`choice-card choice-trick ${hovered === 'trick' ? 'hovered' : ''}`}
          onClick={() => pick('trick')}
          onMouseEnter={() => setHovered('trick')}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered('trick')}
          onBlur={() => setHovered(null)}
          aria-label="Choose Trick — Enter the five-level challenge"
        >
          <span className="choice-icon" aria-hidden="true">🕷️</span>
          <h2 className="choice-card-title">Trick</h2>
          <p className="choice-card-desc">Enter the five-level challenge.</p>
          <div className="choice-card-hint">If you dare</div>
        </button>

      </div>

      <p className="choice-footer">Choose carefully. Both paths lead somewhere.</p>
    </div>
  );
};

export default ChoiceScreen;
