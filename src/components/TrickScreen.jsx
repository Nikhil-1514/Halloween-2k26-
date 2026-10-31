import { useState, useEffect } from "react";
import SpiderPortal from "./SpiderPortal";
import MiniGamesPool from "./MiniGamesPool";
import { useSound } from "../hooks/useSound";
import { halloweenConfig } from "../config/halloweenConfig";

// Total number of mini-games (adjust if more are added)
const TOTAL_GAMES = 15;

export default function TrickScreen({ onSurvived, onFailed, onReturn, reducedMotion }) {
  const [phase, setPhase] = useState("intro"); // intro | playing | secret
  const [currentGameId, setCurrentGameId] = useState(null);
  const [completedGames, setCompletedGames] = useState([]);
  const [progress, setProgress] = useState(0);
  const sound = useSound();

  // Select a random game, respecting no immediate repeats and pool reset
  const selectRandomGame = () => {
    let pool = Array.from({ length: TOTAL_GAMES }, (_, i) => i + 1);
    if (completedGames.length < TOTAL_GAMES) {
      pool = pool.filter((id) => !completedGames.includes(id));
    } else {
      // All played – reset but avoid repeating the last game
      pool = pool.filter((id) => id !== completedGames[completedGames.length - 1]);
      setCompletedGames([]);
    }
    // 5% chance for secret discovery instead of a game
    if (Math.random() < 0.05) return "secret";
    const randomId = pool[Math.floor(Math.random() * pool.length)];
    return randomId;
  };

  const handleSpiderClick = () => {
    sound.creepy();
    const gameId = selectRandomGame();
    if (gameId === "secret") {
      setPhase("secret");
      setTimeout(() => {
        const nextId = selectRandomGame();
        setCurrentGameId(nextId);
        setPhase("playing");
      }, 1800);
    } else {
      setCurrentGameId(gameId);
      setPhase("playing");
    }
  };

  const handleGameComplete = (won) => {
    setCompletedGames((prev) => [...prev, currentGameId]);
    setProgress((prev) => prev + 1);
    setPhase("intro");
    setCurrentGameId(null);
  };

  const SecretMessage = () => (
    <div className="secret-message" role="alert" aria-live="assertive">
      <p>🕷️ You found me.</p>
    </div>
  );

  return (
    <div className="trick-screen screen" role="main">
      {phase === "intro" && (
        <div className="trick-intro fade-in-up" aria-live="polite">
          <p className="screen-tag">YOU CHOSE TRICK.</p>
          <h2 className="screen-title flicker">There are things hiding in here…</h2>
          <p className="screen-body">Touch the spider if you dare.</p>
          <SpiderPortal onClick={handleSpiderClick} />
          <p className="progress-indicator">Tricks survived: {progress} / {TOTAL_GAMES}</p>
        </div>
      )}
      {phase === "playing" && currentGameId && (
        <MiniGamesPool gameId={currentGameId} onComplete={handleGameComplete} />
      )}
      {phase === "secret" && <SecretMessage />}
    </div>
  );
}
