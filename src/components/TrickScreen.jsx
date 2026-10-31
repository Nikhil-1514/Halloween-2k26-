import { useEffect, useRef, useState } from "react";
import Countdown from "./Countdown";
import Jumpscare from "./Jumpscare";
import { getRandomChallenge } from "../data/challenges";
import { getRandomItem, ghostReactions } from "../data/spookyMessages";
import { halloweenConfig } from "../config/halloweenConfig";

const JUMPSCARE_CHANCE = 0.45; // 45% chance of jumpscare during trick flow

export default function TrickScreen({ onSurvived, onFailed, onReturn, reducedMotion }) {
  const [phase, setPhase] = useState("intro"); // intro | reveal | challenge | jumpscare | survived | failed
  const [challenge, setChallenge] = useState(null);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [countdownDone, setCountdownDone] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [ghostMsg, setGhostMsg] = useState("");
  const { hostName } = halloweenConfig;

  useEffect(() => {
    const c = getRandomChallenge();
    setChallenge(c);

    const t1 = setTimeout(() => setPhase("reveal"), 1000);
    const t2 = setTimeout(() => {
      // Maybe trigger jumpscare
      if (Math.random() < JUMPSCARE_CHANCE && !reducedMotion) {
        setShowJumpscare(true);
      } else {
        setPhase("challenge");
      }
    }, 2800);

    return () => [t1, t2].forEach(clearTimeout);
  }, [reducedMotion]);

  const handleJumpscareEnd = () => {
    setShowJumpscare(false);
    setPhase("challenge");
  };

  const handleDidIt = () => {
    if (disabled) return;
    setDisabled(true);
    setGhostMsg(getRandomItem(ghostReactions.survived));
    setPhase("survived");
  };

  const handleCoward = () => {
    if (disabled) return;
    setDisabled(true);
    setGhostMsg(getRandomItem(ghostReactions.failed));
    setPhase("failed");
  };

  const handleTryAgain = () => {
    setDisabled(false);
    setCountdownDone(false);
    setShowJumpscare(false);
    const c = getRandomChallenge();
    setChallenge(c);
    setPhase("challenge");
  };

  const handleAcceptFate = () => {
    if (disabled) return;
    setDisabled(true);
    onFailed();
  };

  return (
    <div className="trick-screen screen" role="main">
      {/* Jumpscare overlay */}
      {showJumpscare && (
        <Jumpscare onDone={handleJumpscareEnd} reducedMotion={reducedMotion} />
      )}

      {phase === "intro" && (
        <div className="trick-screen__content fade-in-up" role="status" aria-live="polite">
          <p className="screen-tag">YOU CHOSE TRICK.</p>
          <h2 className="screen-title flicker">Brave decision.</h2>
        </div>
      )}

      {(phase === "reveal" || phase === "challenge") && (
        <div className="trick-screen__content fade-in-up">
          {phase === "reveal" && (
            <p className="screen-body glow-text" role="status" aria-live="polite">
              Your fate has been decided...
            </p>
          )}

          {phase === "challenge" && challenge && (
            <div className="challenge-card">
              <p className="screen-tag">YOUR CHALLENGE</p>
              <p className="challenge-card__text">{challenge.text}</p>

              {challenge.hasTimer && !countdownDone && (
                <Countdown
                  from={challenge.duration}
                  label={challenge.timerLabel}
                  onComplete={() => setCountdownDone(true)}
                />
              )}

              {(!challenge.hasTimer || countdownDone) && (
                <div className="btn-group btn-group--col">
                  <button
                    className="btn btn--survive"
                    onClick={handleDidIt}
                    disabled={disabled}
                    aria-label="I completed the challenge"
                  >
                    😈 I DID IT
                  </button>
                  <button
                    className="btn btn--coward"
                    onClick={handleCoward}
                    disabled={disabled}
                    aria-label="I am a coward — I give up"
                  >
                    💀 I'M A COWARD
                  </button>
                </div>
              )}

              {challenge.hasTimer && !countdownDone && (
                <p className="screen-body muted" aria-live="polite">
                  Complete the timer to reveal your options.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {phase === "survived" && (
        <div className="trick-screen__content fade-in-up" role="status" aria-live="polite">
          <div className="survived-animation" aria-hidden="true">
            <div className="survived-ring" />
            <span className="survived-icon">👻</span>
          </div>
          <h2 className="screen-title glow-text">YOU SURVIVED.</h2>
          <p className="screen-body">
            <span className="highlight">{hostName}</span> officially owes you
            chocolate.
          </p>
          {ghostMsg && <p className="screen-body muted">{ghostMsg}</p>}
          <div className="btn-group">
            <button
              className="btn btn--ghost"
              onClick={onReturn}
              disabled={disabled}
              aria-label="Return to haunted house"
            >
              RETURN TO HOUSE
            </button>
            <button
              className="btn btn--primary"
              onClick={onSurvived}
              disabled={disabled}
              aria-label="Proceed to final screen"
            >
              CLAIM VICTORY
            </button>
          </div>
        </div>
      )}

      {phase === "failed" && (
        <div className="trick-screen__content fade-in-up" role="status" aria-live="polite">
          <p className="screen-title flicker">THE GHOSTS ARE DISAPPOINTED.</p>
          <p className="screen-body">
            You now owe <span className="highlight">{hostName}</span> TWO
            chocolates.
          </p>
          {ghostMsg && <p className="screen-body muted">{ghostMsg}</p>}
          <div className="btn-group">
            <button
              className="btn btn--ghost"
              onClick={handleTryAgain}
              aria-label="Try a different challenge"
            >
              TRY AGAIN
            </button>
            <button
              className="btn btn--coward"
              onClick={handleAcceptFate}
              disabled={disabled}
              aria-label="Accept your fate"
            >
              ACCEPT YOUR FATE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
