import { useEffect, useRef } from "react";
import { halloweenConfig } from "../config/halloweenConfig";

export default function LandingScreen({ onTreat, onTrick }) {
  const { hostName, year } = halloweenConfig;
  const treatRef = useRef(null);
  const trickRef = useRef(null);

  // Keyboard accessibility — arrow keys between cards
  const handleKeyDown = (e, other) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      other.current?.focus();
    }
  };

  return (
    <div className="landing" role="main">
      <header className="landing__header">
        <p className="landing__date" aria-label={`October 31, ${year}, midnight`}>
          OCTOBER 31 • {year} • MIDNIGHT
        </p>
        <h1 className="landing__title glitch" data-text="WELCOME, MORTAL...">
          WELCOME, MORTAL...
        </h1>
        <p className="landing__subtitle">
          You've entered{" "}
          <span className="highlight">{hostName}'s</span> Haunted Halloween.
        </p>
        <p className="landing__prompt">Tonight, you have only two choices.</p>
      </header>

      <div className="choices" role="group" aria-label="Choose your path">
        {/* TREAT */}
        <button
          ref={treatRef}
          className="choice-card choice-card--treat"
          onClick={onTreat}
          aria-label="Choose Treat: Pay the chocolate tax"
          onKeyDown={(e) => handleKeyDown(e, trickRef)}
        >
          <div className="choice-card__icon" aria-hidden="true">🍫</div>
          <h2 className="choice-card__title">TREAT</h2>
          <p className="choice-card__cta">Pay the chocolate tax.</p>
          <p className="choice-card__desc">
            Give {hostName} chocolate and escape safely.
          </p>
          <div className="choice-card__glow treat-glow" aria-hidden="true" />
        </button>

        {/* TRICK */}
        <button
          ref={trickRef}
          className="choice-card choice-card--trick"
          onClick={onTrick}
          aria-label="Choose Trick: Enter if you dare"
          onKeyDown={(e) => handleKeyDown(e, treatRef)}
        >
          <div className="choice-card__icon" aria-hidden="true">👻</div>
          <h2 className="choice-card__title">TRICK</h2>
          <p className="choice-card__cta">Enter if you dare.</p>
          <p className="choice-card__desc">
            Complete a spooky challenge and earn your chocolate.
          </p>
          <div className="choice-card__glow trick-glow" aria-hidden="true" />
        </button>
      </div>

      <p className="landing__footer" aria-hidden="true">
        Choose wisely. The house is watching.
      </p>
    </div>
  );
}
