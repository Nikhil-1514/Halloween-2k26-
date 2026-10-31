import { useState, useEffect, useRef } from 'react';
import './FinalExit.css';

/**
 * FINAL EXIT — "The house is closed."
 * Closing cinematic with restart option
 */
const FinalExit = ({ participant, route, onRestart }) => {
  const [step, setStep]       = useState(0);
  const [restarting, setRest] = useState(false);
  const timers                = useRef([]);
  const locked                = useRef(false);

  const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => {
    add(() => setStep(1), 800);
    add(() => setStep(2), 2400);
    add(() => setStep(3), 4000);
    add(() => setStep(4), 5600);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleRestart = () => {
    if (locked.current) return;
    locked.current = true;
    setRest(true);
    setTimeout(onRestart, 900);
  };

  const isTreat   = route === 'treat';
  const closingMsg = isTreat
    ? 'A debt of chocolate has been recorded.'
    : 'The house has closed its doors.';

  return (
    <div className={`exit-scene ${restarting ? 'exiting' : ''}`}>
      <div className="exit-vignette" aria-hidden="true" />

      <div className="exit-content">
        {step >= 1 && (
          <p className="exit-date">October 31</p>
        )}
        {step >= 2 && (
          <h1 className="exit-title">The House Is Closed.</h1>
        )}
        {step >= 3 && (
          <div className="exit-message">
            <p>{closingMsg}</p>
            {participant?.name && (
              <p className="exit-participant">
                Until next year, <em>{participant.name}</em>.
              </p>
            )}
          </div>
        )}
        {step >= 3 && (
          <div className="exit-divider" />
        )}
        {step >= 4 && (
          <p className="exit-footer">🎃</p>
        )}
        {step >= 4 && (
          <button
            id="exit-restart-btn"
            className="btn btn-ghost exit-restart"
            onClick={handleRestart}
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
};

export default FinalExit;
