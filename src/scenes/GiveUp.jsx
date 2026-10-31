import { useState } from 'react';
import { getReward } from '../utils/rewards';
import './GiveUp.css';

/**
 * GIVE UP SCREEN
 * Shows level-appropriate reward when participant exits early
 */
const GiveUp = ({ level, participant, onDone }) => {
  const [exiting, setExiting] = useState(false);
  const reward = getReward(level);

  const handleDone = () => {
    setExiting(true);
    setTimeout(onDone, 800);
  };

  return (
    <div className={`giveup-scene ${exiting ? 'exiting' : ''}`}>
      <div className="giveup-content">
        <p className="giveup-choice">You chose to leave.</p>
        <div className="divider-ember" />
        <p className="giveup-wisdom">Perhaps that was the smart choice.</p>

        <div className="giveup-badge" aria-hidden="true">{reward.badge}</div>

        <div className="giveup-card">
          <p className="giveup-status">{reward.status}</p>
          <h1 className="giveup-title">{reward.title}</h1>
          <p className="giveup-subtitle">{reward.subtitle}</p>
          <div className="giveup-divider" />
          <p className="giveup-description">{reward.description}</p>

          {participant?.name && (
            <p className="giveup-name">— {participant.name}</p>
          )}
        </div>

        <button
          id="giveup-done-btn"
          className="btn btn-ghost giveup-btn"
          onClick={handleDone}
          autoFocus
        >
          Leave
        </button>
      </div>
    </div>
  );
};

export default GiveUp;
