import { useCallback, useEffect, useRef, useState } from "react";
import HauntedBackground from "./components/HauntedBackground";
import IntroScreen from "./components/IntroScreen";
import LandingScreen from "./components/LandingScreen";
import TreatScreen from "./components/TreatScreen";
import TrickScreen from "./components/TrickScreen";
import FinalScreen from "./components/FinalScreen";
import SoundToggle from "./components/SoundToggle";
import EasterEggs, { useMoonEasterEgg, usePumpkinEasterEgg } from "./components/EasterEggs";
// spookyMessages used via EasterEggs hooks only

// ── App States ─────────────────────────────────────────────────
// INTRO → LANDING → TREAT | TRICK → FINAL
const STATES = {
  INTRO: "INTRO",
  LANDING: "LANDING",
  TREAT: "TREAT",
  TRICK: "TRICK",
  FINAL: "FINAL",
};

// ── Ambient audio via Web Audio API (no external files needed) ─
function createAmbientOscillator(ctx) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(55, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(58, ctx.currentTime + 6);
  osc.frequency.linearRampToValueAtTime(52, ctx.currentTime + 12);
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start();
  return { osc, gainNode };
}

// ── Safe localStorage ──────────────────────────────────────────
const safeLS = {
  get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, val); } catch {} },
};

// ── Detect reduced motion ──────────────────────────────────────
const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export default function App() {
  const [appState, setAppState] = useState(() =>
    safeLS.get("hh_seen") === "1" ? STATES.LANDING : STATES.INTRO
  );
  const [finalOutcome, setFinalOutcome] = useState("treat");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [moonGlowing, setMoonGlowing] = useState(false);
  const [toast, setToast] = useState(null); // { msg, type }
  const [hasInteracted, setHasInteracted] = useState(false);
  const [reducedMotion] = useState(prefersReducedMotion);

  const audioCtxRef = useRef(null);
  const audioNodesRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // ── Toast helper ───────────────────────────────────────────
  const showToast = useCallback((msg, type = "default") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ msg, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Easter egg hooks ────────────────────────────────────────
  const handleMoonClick = useMoonEasterEgg(showToast);
  const handlePumpkinClick = usePumpkinEasterEgg(showToast);

  // ── Moon glow on click ─────────────────────────────────────
  const onMoonClick = () => {
    setMoonGlowing(true);
    setTimeout(() => setMoonGlowing(false), 1200);
    handleMoonClick();
    if (!hasInteracted) setHasInteracted(true);
  };

  // ── Audio ──────────────────────────────────────────────────
  const startAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
        audioNodesRef.current = createAmbientOscillator(ctx);
      } else if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } catch (err) {
      console.warn("Audio unavailable:", err);
    }
  }, []);

  const stopAudio = useCallback(() => {
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend();
      }
    } catch {}
  }, []);

  const toggleAudio = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (audioEnabled) {
      stopAudio();
      setAudioEnabled(false);
    } else {
      startAudio();
      setAudioEnabled(true);
    }
  };

  // ── State transitions ──────────────────────────────────────
  const goTo = (state) => {
    if (!hasInteracted) setHasInteracted(true);
    setAppState(state);
  };

  const handleIntroComplete = () => {
    safeLS.set("hh_seen", "1");
    goTo(STATES.LANDING);
  };

  const handleTreat = () => goTo(STATES.TREAT);
  const handleTrick = () => goTo(STATES.TRICK);

  const handleTreatFinal = () => {
    setFinalOutcome("treat");
    goTo(STATES.FINAL);
  };

  const handleSurvived = () => {
    setFinalOutcome("survived");
    goTo(STATES.FINAL);
  };

  const handleFailed = () => {
    setFinalOutcome("failed");
    goTo(STATES.FINAL);
  };

  const handleReturnToLanding = () => goTo(STATES.LANDING);

  const handlePlayAgain = () => {
    safeLS.set("hh_seen", "1");
    goTo(STATES.LANDING);
  };

  const handleClosePortal = () => {
    stopAudio();
    // App fades to black (CSS handles it), then just stays dark
  };

  // ── Cleanup audio on unmount ───────────────────────────────
  useEffect(() => {
    return () => {
      try { audioCtxRef.current?.close(); } catch {}
    };
  }, []);

  return (
    <div className={`app${reducedMotion ? " reduced-motion" : ""}`}>
      {/* Animated spooky background — always present */}
      <HauntedBackground onMoonClick={onMoonClick} moonGlowing={moonGlowing} />

      {/* Secret pumpkin — hidden in bottom-right corner */}
      <button
        className="secret-pumpkin"
        onClick={handlePumpkinClick}
        aria-label="Secret pumpkin — Easter egg"
        tabIndex={-1}
      >
        🎃
      </button>

      {/* Easter egg: keyboard sequence */}
      <EasterEggs onToast={showToast} />

      {/* Sound toggle */}
      <SoundToggle audioEnabled={audioEnabled} onToggle={toggleAudio} interacted={hasInteracted} />

      {/* Toast notification */}
      {toast && (
        <div
          className={`toast toast--${toast.type}`}
          role="status"
          aria-live="polite"
          key={toast.msg}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Screens ── */}
      <main className="screen-container">
        {appState === STATES.INTRO && (
          <IntroScreen onComplete={handleIntroComplete} />
        )}

        {appState === STATES.LANDING && (
          <LandingScreen onTreat={handleTreat} onTrick={handleTrick} />
        )}

        {appState === STATES.TREAT && (
          <TreatScreen onReturn={handleReturnToLanding} onFinal={handleTreatFinal} />
        )}

        {appState === STATES.TRICK && (
          <TrickScreen
            onSurvived={handleSurvived}
            onFailed={handleFailed}
            onReturn={handleReturnToLanding}
            reducedMotion={reducedMotion}
          />
        )}

        {appState === STATES.FINAL && (
          <FinalScreen
            outcome={finalOutcome}
            onPlayAgain={handlePlayAgain}
            onClose={handleClosePortal}
          />
        )}
      </main>
    </div>
  );
}
