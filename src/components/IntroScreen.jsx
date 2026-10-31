import { useEffect, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";
import { getRandomItem, spookyIntros, spookyFollowUps } from "../data/spookyMessages";

/* ── Bat swarm data ── */
const BAT_COUNT = 12;
const makeBats = () =>
  Array.from({ length: BAT_COUNT }, (_, i) => ({
    id: i,
    delay: 0.2 + Math.random() * 1.8,
    y: 8 + Math.random() * 60,
    size: 22 + Math.random() * 18,
    dur: 2 + Math.random() * 2,
    flipY: Math.random() > 0.5,
  }));

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState("dark");
  // dark → bats → cape → fangs → text → done
  const [introText, setIntroText] = useState("");
  const [followText, setFollowText] = useState("");
  const [bats] = useState(makeBats);
  const sound = useSound();
  const laughRef = useRef(null);

  /* ── Creepy laugh via Web Audio API ── */
  const playCreepyLaugh = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Layer 1 – descending tremolo
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        const startFreq = 320 - i * 35;
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime + i * 0.18);
        osc.frequency.linearRampToValueAtTime(startFreq - 60, ctx.currentTime + i * 0.18 + 0.16);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.18 + 0.04);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.18);
      }
      // Layer 2 – low rumble
      const rumble = ctx.createOscillator();
      const rGain = ctx.createGain();
      rumble.type = "sine";
      rumble.frequency.setValueAtTime(60, ctx.currentTime);
      rGain.gain.setValueAtTime(0.001, ctx.currentTime);
      rGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
      rGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      rumble.connect(rGain).connect(ctx.destination);
      rumble.start();
      rumble.stop(ctx.currentTime + 1.6);
      laughRef.current = ctx;
    } catch {}
  };

  useEffect(() => {
    setIntroText(getRandomItem(spookyIntros));
    setFollowText(getRandomItem(spookyFollowUps));

    // Timeline: dark(300ms) → bats(1200ms) → cape(1800ms) → fangs(2600ms) → text(3400ms) → done(5000ms)
    const t0 = setTimeout(() => { setPhase("bats"); playCreepyLaugh(); }, 300);
    const t1 = setTimeout(() => setPhase("cape"), 1500);
    const t2 = setTimeout(() => setPhase("fangs"), 2800);
    const t3 = setTimeout(() => setPhase("text"), 3800);
    const t4 = setTimeout(() => setPhase("followup"), 5200);
    const t5 = setTimeout(() => setPhase("done"), 6400);
    const t6 = setTimeout(() => onComplete(), 7000);

    return () => {
      [t0, t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
      try { laughRef.current?.close(); } catch {}
    };
  }, [onComplete]);

  if (phase === "done") {
    return <div className="intro-screen intro-screen--fade-out" aria-hidden="true" />;
  }

  return (
    <div className={`intro-screen${phase === "dark" ? "" : " intro-screen--visible"}`} role="status" aria-live="polite">
      <div className="intro-grain" aria-hidden="true" />

      {/* ── BAT SWARM ── */}
      {(phase === "bats" || phase === "cape" || phase === "fangs" || phase === "text" || phase === "followup") && (
        <div className="intro-bats" aria-hidden="true">
          {bats.map((b) => (
            <div
              key={b.id}
              className="intro-bat"
              style={{
                top: `${b.y}%`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.dur}s`,
                fontSize: `${b.size}px`,
                transform: b.flipY ? "scaleX(-1)" : "none",
              }}
            >
              <span className="intro-bat__body">🦇</span>
            </div>
          ))}
        </div>
      )}

      {/* ── DRACULA CAPE ── */}
      {(phase === "cape" || phase === "fangs" || phase === "text" || phase === "followup") && (
        <div className="intro-cape" aria-hidden="true">
          <div className="intro-cape__left" />
          <div className="intro-cape__right" />
          <div className="intro-cape__collar" />
        </div>
      )}

      {/* ── FANGS / TEETH ── */}
      {(phase === "fangs" || phase === "text" || phase === "followup") && (
        <div className="intro-fangs" aria-hidden="true">
          <div className="intro-fang intro-fang--left">🦷</div>
          <div className="intro-fang intro-fang--right">🦷</div>
          <div className="intro-eyes">
            <span className="intro-eye intro-eye--left">👁️</span>
            <span className="intro-eye intro-eye--right">👁️</span>
          </div>
        </div>
      )}

      {/* ── SPOOKY TEXT ── */}
      {phase === "text" && (
        <p className="intro-text intro-text--flicker">{introText}</p>
      )}
      {phase === "followup" && (
        <p className="intro-text intro-text--appear">{followText}</p>
      )}

      <button className="skip-btn" onClick={onComplete} aria-label="Skip intro animation">
        Skip intro
      </button>
    </div>
  );
}
