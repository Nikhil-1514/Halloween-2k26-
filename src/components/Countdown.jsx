import { useEffect, useRef, useState } from "react";

export default function Countdown({ from, label, onComplete }) {
  const [count, setCount] = useState(from);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimeout(() => onComplete?.(), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [from, onComplete]);

  const pct = (count / from) * 100;
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div className="countdown" role="timer" aria-label={`${count} seconds remaining`}>
      <svg className="countdown__ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(124,58,237,0.25)"
          strokeWidth="6"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--clr-orange)"
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dasharray 0.9s linear" }}
        />
      </svg>
      <div className="countdown__inner">
        <span className="countdown__number">{count}</span>
        {label && <span className="countdown__label">{label}</span>}
      </div>
    </div>
  );
}
