import { useEffect, useState } from "react";
import './SpiderPortal.css';

export default function SpiderPortal({ onClick }) {
  const [animClass, setAnimClass] = useState('');

  // Trigger random twitch/jump animation every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const animations = ['twitch', 'jump', 'blink', 'disappear'];
      const choice = animations[Math.floor(Math.random() * animations.length)];
      setAnimClass(choice);
      // reset after short duration
      setTimeout(() => setAnimClass(''), 800);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    onClick && onClick(e);
  };

  return (
    <div className={`spider-portal ${animClass}`} onClick={handleClick} role="button" aria-label="Mysterious spider">
      <div className="spider-body">
        <div className="spider-eyes" />
        <div className="spider-legs" />
      </div>
    </div>
  );
}
