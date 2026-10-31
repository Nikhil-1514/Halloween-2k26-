import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../utils/audio';
import './GreetingCard.css';

/**
 * PERSONAL GREETING CARD FROM NIKHIL
 * Steps:
 *  0 → "A message for you..." text
 *  1 → Envelope appears
 *  2 → Envelope flap opens
 *  3 → Card slides up out of envelope
 *  4 → Card content reveals (typed)
 *  5 → CONTINUE button appears
 */
const GreetingCard = ({ onComplete, soundEnabled }) => {
  const [step, setStep]       = useState(0);
  const [exiting, setExiting] = useState(false);
  const locked                = useRef(false);
  const timers                = useRef([]);

  const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => {
    add(() => setStep(1), 600);
    add(() => setStep(2), 1400);
    add(() => setStep(3), 2600);
    add(() => setStep(4), 3800);
    add(() => setStep(5), 5200);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleContinue = () => {
    if (locked.current) return;
    locked.current = true;
    if (soundEnabled) audioManager.playTransition();
    setExiting(true);
    setTimeout(onComplete, 1000);
  };

  return (
    <div className={`card-scene ${exiting ? 'exiting' : ''}`}>
      {/* Particle stars */}
      <div className="card-stars" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left:  `${Math.random() * 100}%`,
              top:   `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              width:  `${1 + Math.random() * 1.5}px`,
              height: `${1 + Math.random() * 1.5}px`,
            }}
          />
        ))}
      </div>

      {/* Ambient moon glow */}
      <div className="card-moon-glow" aria-hidden="true" />

      {/* "A message for you..." */}
      {step >= 0 && (
        <p className="card-prelude">A message for you...</p>
      )}

      {/* Envelope + Card system */}
      {step >= 1 && (
        <div className="envelope-container">
          {/* Envelope body */}
          <div className="envelope-body">
            {/* Flap */}
            <div className={`envelope-flap ${step >= 2 ? 'open' : ''}`}>
              <svg viewBox="0 0 280 140" preserveAspectRatio="none" className="flap-svg">
                <polygon points="0,0 280,0 140,110" fill="#1a0c0c" stroke="#2a1510" strokeWidth="1" />
              </svg>
            </div>

            {/* Envelope sides decoration */}
            <svg viewBox="0 0 280 180" className="envelope-svg" aria-hidden="true">
              <polygon points="0,180 140,80 280,180" fill="#160909" />
              <line x1="0" y1="0" x2="140" y2="80"  stroke="#2a1510" strokeWidth="1" />
              <line x1="280" y1="0" x2="140" y2="80" stroke="#2a1510" strokeWidth="1" />
            </svg>

            {/* Wax seal on envelope */}
            <div className="envelope-seal" aria-hidden="true">🎃</div>
          </div>

          {/* Card that slides up */}
          {step >= 3 && (
            <div className="halloween-card">
              {/* Card ornamental top */}
              <div className="card-ornament">
                <span className="card-bat" aria-hidden="true">🦇</span>
                <div className="card-ornament-line" />
                <span className="card-bat" aria-hidden="true">🦇</span>
              </div>

              <h1 className="card-title">
                🎃 Happy Halloween 🎃
              </h1>

              {step >= 4 && (
                <>
                  <p className="card-from">A little Halloween surprise from Nikhil</p>

                  <div className="card-divider" />

                  <div className="card-message">
                    <p>Hey!</p>
                    <p>
                      Halloween isn't just about scares, costumes, and chocolates.
                    </p>
                    <p>
                      It's about having a little fun, doing something unexpected,
                      and creating memories with the people around us.
                    </p>
                    <p>
                      So I made something a little different for you this Halloween.
                    </p>
                    <p>
                      You can take the easy way...
                    </p>
                    <p className="card-or">
                      <em>or</em>
                    </p>
                    <p>
                      you can find out how brave you really are. 👀
                    </p>
                  </div>

                  <p className="card-choose">Choose wisely.</p>

                  <div className="card-signature">— Nikhil</div>

                  {/* Bottom ornament */}
                  <div className="card-ornament card-ornament-bottom">
                    <div className="card-ornament-line" />
                    <span className="card-pumpkin" aria-hidden="true">🎃</span>
                    <div className="card-ornament-line" />
                  </div>
                </>
              )}

              {step >= 5 && (
                <button
                  id="card-continue-btn"
                  className="btn btn-primary card-continue"
                  onClick={handleContinue}
                  autoFocus
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GreetingCard;
