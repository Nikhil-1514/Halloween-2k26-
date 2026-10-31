import { useState } from "react";
import { halloweenConfig } from "../config/halloweenConfig";

export default function FinalScreen({ outcome, onPlayAgain, onClose }) {
  const [closing, setClosing] = useState(false);
  const { hostName } = halloweenConfig;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 1400);
  };

  if (closing) {
    return <div className="final-screen final-screen--closing" aria-hidden="true" />;
  }

  return (
    <div className="final-screen screen" role="main">
      <div className="final-screen__content fade-in-up">
        <div className="final-pumpkin" aria-hidden="true">🎃</div>
        <h2 className="final-title">HAPPY HALLOWEEN</h2>
        <p className="final-subtitle">
          You survived <span className="highlight">{hostName}'s</span> Haunted
          House.
        </p>

        {outcome === "survived" && (
          <p className="screen-body glow-text">
            The spirits honour your bravery. Chocolate is owed.
          </p>
        )}
        {outcome === "treat" && (
          <p className="screen-body glow-text">
            A wise and chocolatey choice. The house approves.
          </p>
        )}
        {outcome === "failed" && (
          <p className="screen-body glow-text">
            Even cowards are welcome here. The ghosts forgive you.
          </p>
        )}

        <p className="screen-body">Thanks for playing.</p>
        <p className="final-ghost">Stay spooky. 👻</p>

        <div className="btn-group">
          <button
            className="btn btn--primary"
            onClick={onPlayAgain}
            aria-label="Play again from the beginning"
          >
            PLAY AGAIN
          </button>
          <button
            className="btn btn--ghost"
            onClick={handleClose}
            aria-label="Close the portal"
          >
            CLOSE THE PORTAL
          </button>
        </div>
      </div>
    </div>
  );
}
