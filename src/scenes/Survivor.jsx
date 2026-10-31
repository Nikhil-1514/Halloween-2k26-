import { useState, useEffect, useRef } from 'react';
import { getReward } from '../utils/rewards';
import { audioManager } from '../utils/audio';
import './Survivor.css';

/**
 * ULTIMATE SURVIVOR — cinematic reveal for completing all 5 levels
 */
const Survivor = ({ participant, soundEnabled, onDone }) => {
  const [step, setStep]       = useState(0);
  const [exiting, setExiting] = useState(false);
  const reward                = getReward(5);
  const timers                = useRef([]);
  const locked                = useRef(false);

  const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => {
    if (soundEnabled) add(() => audioManager.playSurvivor(), 800);
    add(() => setStep(1), 600);
    add(() => setStep(2), 2200);
    add(() => setStep(3), 3800);
    add(() => setStep(4), 5400);
    add(() => setStep(5), 7000);
    return () => timers.current.forEach(clearTimeout);
  }, [soundEnabled]);

  // Subtle particle field
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 6,
    drift: `${(Math.random() - 0.5) * 60}px`,
    duration: 5 + Math.random() * 5,
    size: 2 + Math.random() * 2,
  }));

  const handleDone = () => {
    if (locked.current) return;
    locked.current = true;
    setExiting(true);
    setTimeout(onDone, 800);
  };

  return (
    <div className={`survivor-scene ${exiting ? 'exiting' : ''}`}>
      {/* Particles */}
      <div className="survivor-particles" aria-hidden="true">
        {particles.map(p => (
          <span
            key={p.id}
            className="survivor-particle"
            style={{
              left:                  `${p.x}%`,
              '--drift':             p.drift,
              animationDelay:        `${p.delay}s`,
              animationDuration:     `${p.duration}s`,
              width:                 `${p.size}px`,
              height:                `${p.size}px`,
            }}
          />
        ))}
      </div>

      {/* Gold radial */}
      <div className="survivor-glow" aria-hidden="true" />

      <div className="survivor-content">
        {step >= 1 && (
          <div className="survivor-crown" aria-hidden="true">👑</div>
        )}
        {step >= 2 && (
          <div className="survivor-header">
            <p className="survivor-status">5 / 5 Levels Completed</p>
            <h1 className="survivor-title">{reward.title}</h1>
          </div>
        )}
        {step >= 3 && participant?.name && (
          <p className="survivor-name">{participant.name}</p>
        )}
        {step >= 4 && (
          <div className="survivor-card">
            <div className="survivor-row">
              <span className="survivor-label">Status</span>
              <span className="survivor-value survivor-value-gold">{reward.status}</span>
            </div>
            <div className="survivor-row">
              <span className="survivor-label">Levels</span>
              <span className="survivor-value">5 / 5</span>
            </div>
            <div className="survivor-row">
              <span className="survivor-label">Reward</span>
              <span className="survivor-value">{reward.subtitle}</span>
            </div>
          </div>
        )}
        {step >= 4 && (
          <p className="survivor-description">{reward.description}</p>
        )}
        {step >= 5 && (
          <button
            id="survivor-done-btn"
            className="btn btn-gold survivor-btn"
            onClick={handleDone}
            autoFocus
          >
            The House Is Closed
          </button>
        )}
      </div>
    </div>
  );
};

export default Survivor;
