import { useEffect, useRef, useState } from "react";
import { jumpscareMessages, getRandomItem } from "../data/spookyMessages";

export default function Jumpscare({ onDone, reducedMotion }) {
  const [phase, setPhase] = useState("appear"); // appear | calm
  const [msg] = useState(() => getRandomItem(jumpscareMessages));
  const elRef = useRef(null);

  useEffect(() => {
    // Brief shake, then calm down
    const t1 = setTimeout(() => setPhase("calm"), 900);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => [t1, t2].forEach(clearTimeout);
  }, [onDone]);

  if (reducedMotion) {
    // Reduced-motion: just text, no flash
    return (
      <div className="jumpscare jumpscare--calm" role="alert" aria-live="assertive" ref={elRef}>
        <p className="jumpscare__boo">{msg}</p>
        <p className="jumpscare__calm">Okay okay... calm down.</p>
      </div>
    );
  }

  return (
    <div
      className={`jumpscare ${phase === "appear" ? "jumpscare--appear" : "jumpscare--calm"}`}
      role="alert"
      aria-live="assertive"
      ref={elRef}
    >
      {/* Ghost silhouette */}
      {phase === "appear" && (
        <div className="jumpscare__ghost" aria-hidden="true">
          <svg viewBox="0 0 100 130" fill="none">
            <path
              d="M50 10 C20 10 10 35 10 60 L10 120 L22 108 L34 120 L46 108 L58 120 L70 108 L82 120 L90 120 L90 60 C90 35 80 10 50 10Z"
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />
            <ellipse cx="38" cy="55" rx="7" ry="9" fill="rgba(0,0,0,0.6)" />
            <ellipse cx="62" cy="55" rx="7" ry="9" fill="rgba(0,0,0,0.6)" />
          </svg>
        </div>
      )}
      <p className="jumpscare__boo">{msg}</p>
      {phase === "calm" && (
        <p className="jumpscare__calm">Okay okay... calm down.</p>
      )}
    </div>
  );
}
