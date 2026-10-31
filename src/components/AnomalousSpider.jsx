import { useEffect, useRef, useState, useCallback } from 'react';
import './AnomalousSpider.css';

/**
 * The Anomalous Spider — a slightly unnatural CSS/SVG spider
 * that drifts, twitches, and reacts between levels.
 */
const AnomalousSpider = ({ visible, intensity = 1 }) => {
  const [pos, setPos]           = useState({ x: 82, y: 12 });
  const [twitching, setTwitch]  = useState(false);
  const [dimmed, setDimmed]     = useState(false);
  const timerRef                = useRef(null);

  const scheduleNext = useCallback(() => {
    const delay = 2500 + Math.random() * 6000;
    timerRef.current = setTimeout(() => {
      const roll = Math.random();
      if (roll < 0.25) {
        // Twitch
        setTwitch(true);
        setTimeout(() => setTwitch(false), 600);
      } else if (roll < 0.55) {
        // Drift slightly
        setPos(prev => ({
          x: Math.max(4, Math.min(92, prev.x + (Math.random() - 0.5) * 18)),
          y: Math.max(4, Math.min(85, prev.y + (Math.random() - 0.5) * 14)),
        }));
      } else if (roll < 0.65) {
        // Blink out briefly
        setDimmed(true);
        setTimeout(() => setDimmed(false), 300 + Math.random() * 600);
      }
      scheduleNext();
    }, delay);
  }, []);

  useEffect(() => {
    if (!visible) return;
    scheduleNext();
    return () => clearTimeout(timerRef.current);
  }, [visible, scheduleNext]);

  // Intensity bump: more aggressive at higher levels
  useEffect(() => {
    if (intensity >= 4 && visible) {
      setTwitch(true);
      setTimeout(() => setTwitch(false), 800);
    }
  }, [intensity, visible]);

  if (!visible) return null;

  const eyeGlow = `rgba(127,255,0,${0.5 + intensity * 0.1})`;
  const dropShadow = `drop-shadow(0 0 ${3 + intensity * 2}px ${eyeGlow})`;

  return (
    <div
      className={`spider-wrapper ${twitching ? 'twitching' : ''} ${dimmed ? 'dimmed' : ''}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 90 90"
        width={52}
        height={52}
        className="spider-svg"
        style={{ filter: dropShadow }}
      >
        {/* Abdomen */}
        <ellipse cx="45" cy="54" rx="9" ry="12" fill="#0b0b0b" stroke="#111f0a" strokeWidth="0.6" />
        {/* Cephalothorax */}
        <ellipse cx="45" cy="38" rx="7" ry="8"  fill="#0b0b0b" stroke="#111f0a" strokeWidth="0.6" />

        {/* Eyes — slightly asymmetric */}
        <circle cx="42" cy="34"   r="2.2" fill="#7fff00" style={{ animation: 'spiderEyes 2.4s ease-in-out infinite' }} />
        <circle cx="48.5" cy="33.2" r="1.9" fill="#7fff00" style={{ animation: 'spiderEyes 2.4s ease-in-out infinite 0.4s' }} />
        <circle cx="42" cy="34"   r="0.9" fill="#ffffff" opacity="0.7" />
        <circle cx="48.5" cy="33.2" r="0.7" fill="#ffffff" opacity="0.7" />

        {/* Left legs */}
        <path d="M38 42 Q22 33 12 24" stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M38 46 Q20 44 8 42"  stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M38 50 Q21 56 11 62" stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M38 54 Q22 63 15 73" stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {/* Right legs — slightly different angles for uncanny effect */}
        <path d="M52 41 Q67 31 78 22"  stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M52 45 Q70 43 82 40"  stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M52 49 Q69 55 79 64"  stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M52 53 Q67 64 75 75"  stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {/* Leg joints (knees) — break points for uncanny look */}
        <circle cx="22" cy="33"  r="1.1" fill="#191919" />
        <circle cx="20" cy="43"  r="1.1" fill="#191919" />
        <circle cx="21" cy="57"  r="1.1" fill="#191919" />
        <circle cx="23" cy="65"  r="1.1" fill="#191919" />
        <circle cx="67" cy="31"  r="1.1" fill="#191919" />
        <circle cx="70" cy="42"  r="1.1" fill="#191919" />
        <circle cx="69" cy="56"  r="1.1" fill="#191919" />
        <circle cx="67" cy="66"  r="1.1" fill="#191919" />

        {/* Spinnerets */}
        <ellipse cx="45" cy="66" rx="2.5" ry="3" fill="#0f0f0f" />
      </svg>
    </div>
  );
};

export default AnomalousSpider;
