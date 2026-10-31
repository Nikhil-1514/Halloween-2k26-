import { audioManager } from '../utils/audio';
import './SoundToggle.css';

const SoundToggle = ({ enabled, onToggle }) => {
  const handleClick = () => {
    const next = !enabled;
    onToggle(next);
    audioManager.setEnabled(next);
    if (next) {
      audioManager.playClick();
      audioManager.startAmbience();
    }
  };

  return (
    <button
      id="sound-toggle"
      className="sound-toggle"
      onClick={handleClick}
      aria-label={enabled ? 'Mute sound' : 'Enable sound'}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
};

export default SoundToggle;
