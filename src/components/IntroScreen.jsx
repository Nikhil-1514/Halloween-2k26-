import { useEffect, useState } from "react";
import { getRandomItem, spookyIntros, spookyFollowUps } from "../data/spookyMessages";

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState("dark"); // dark | watching | here | done
  const [introText, setIntroText] = useState("");
  const [followText, setFollowText] = useState("");

  useEffect(() => {
    setIntroText(getRandomItem(spookyIntros));
    setFollowText(getRandomItem(spookyFollowUps));

    const t1 = setTimeout(() => setPhase("watching"), 300);
    const t2 = setTimeout(() => setPhase("here"), 1400);
    const t3 = setTimeout(() => setPhase("done"), 2500);
    const t4 = setTimeout(() => onComplete(), 3100);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  if (phase === "done") {
    return <div className="intro-screen intro-screen--fade-out" aria-hidden="true" />;
  }

  return (
    <div className={`intro-screen${phase === "dark" ? "" : " intro-screen--visible"}`} role="status" aria-live="polite">
      <div className="intro-grain" aria-hidden="true" />
      {phase === "watching" && (
        <p className="intro-text intro-text--flicker">{introText}</p>
      )}
      {phase === "here" && (
        <p className="intro-text intro-text--appear">{followText}</p>
      )}
      <button
        className="skip-btn"
        onClick={onComplete}
        aria-label="Skip intro animation"
      >
        Skip intro
      </button>
    </div>
  );
}
