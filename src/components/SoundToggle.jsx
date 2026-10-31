import { useState, useEffect } from "react";

export default function SoundToggle({ audioEnabled, onToggle, interacted }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      className={`sound-toggle ${visible ? "sound-toggle--visible" : ""}`}
      onClick={onToggle}
      aria-label={audioEnabled ? "Disable spooky sounds" : "Enable spooky sounds"}
      title={audioEnabled ? "Sound ON" : "Sound OFF"}
      type="button"
    >
      {audioEnabled ? (
        <span aria-hidden="true">🔊</span>
      ) : (
        <span aria-hidden="true">🔇</span>
      )}
      <span className="sound-toggle__label">
        {audioEnabled ? "SOUND ON" : "SOUND OFF"}
      </span>
    </button>
  );
}
