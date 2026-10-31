import { useState } from "react";
import { halloweenConfig } from "../config/halloweenConfig";

export default function TreatScreen({ onReturn, onFinal }) {
  const [phase, setPhase] = useState("intro"); // intro | accepted | done
  const { hostName, chocolateCount } = halloweenConfig;
  const [disabled, setDisabled] = useState(false);

  const handleAccept = () => {
    if (disabled) return;
    setDisabled(true);
    setPhase("accepted");
    setTimeout(() => {
      setPhase("done");
      setDisabled(false);
    }, 2200);
  };

  const handleReturn = () => {
    if (disabled) return;
    setDisabled(true);
    onReturn();
  };

  const handleFinal = () => {
    if (disabled) return;
    setDisabled(true);
    onFinal();
  };

  return (
    <div className="treat-screen screen" role="main">
      {phase === "intro" && (
        <div className="treat-screen__content fade-in-up">
          <p className="screen-tag">THE CHOCOLATE TAX</p>
          <h2 className="screen-title">
            Congratulations.
            <br />
            You chose the peaceful path.
          </h2>
          <p className="screen-body">Unfortunately, peace has a price.</p>

          <div className="tax-display" aria-label={`${chocolateCount} chocolate`}>
            <span className="tax-display__icon" aria-hidden="true">🍫</span>
            <span className="tax-display__count">
              {chocolateCount} CHOCOLATE
            </span>
          </div>

          <p className="screen-body">
            Hand over the chocolate to{" "}
            <span className="highlight">{hostName}</span> to complete your
            sacrifice.
          </p>

          <button
            className="btn btn--primary"
            onClick={handleAccept}
            disabled={disabled}
            aria-label="Accept the chocolate tax"
          >
            I ACCEPT THE CHOCOLATE TAX
          </button>
        </div>
      )}

      {phase === "accepted" && (
        <div className="treat-screen__content fade-in-up" role="status" aria-live="polite">
          <div className="payment-animation" aria-hidden="true">
            <div className="payment-ring" />
            <span className="payment-check">✓</span>
          </div>
          <h2 className="screen-title glow-text">PAYMENT ACCEPTED.</h2>
        </div>
      )}

      {phase === "done" && (
        <div className="treat-screen__content fade-in-up" role="status" aria-live="polite">
          <h2 className="screen-title glow-text">PAYMENT ACCEPTED.</h2>
          <p className="screen-body">You may leave the haunted house alive.</p>
          <p className="screen-title--lg" aria-label="Happy Halloween">
            🎃 Happy Halloween!
          </p>
          <p className="screen-body muted">
            Remember... <span className="highlight">{hostName}</span> is still
            waiting for the chocolate.
          </p>
          <div className="btn-group">
            <button
              className="btn btn--ghost"
              onClick={handleReturn}
              disabled={disabled}
              aria-label="Return to the haunted house"
            >
              RETURN TO THE HAUNTED HOUSE
            </button>
            <button
              className="btn btn--primary"
              onClick={handleFinal}
              disabled={disabled}
              aria-label="Proceed to final screen"
            >
              FINAL FAREWELL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
