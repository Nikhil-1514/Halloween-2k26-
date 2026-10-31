import { useState, useCallback, useRef } from 'react';
import { SCENES, INITIAL_STATE } from './state/gameState';
import { audioManager }          from './utils/audio';

// ── Existing scenes (preserved) ─────────────────────────────────
import Opening      from './scenes/Opening';
import GreetingCard from './scenes/GreetingCard';
import ChoiceScreen from './scenes/ChoiceScreen';
import TreatRoute   from './scenes/TreatRoute';
import TrickIntro   from './scenes/TrickIntro';
import GiveUp       from './scenes/GiveUp';
import FinalExit    from './scenes/FinalExit';

// ── Upgraded level system ─────────────────────────────────────
import LevelShell   from './levels/LevelShell';      // Levels 1–3
import Level4Arcade from './levels/Level4Arcade';    // Level 4 full arcade
import Level5       from './scenes/Level5';          // Level 5 final nightmare

// ── New ending scenes ─────────────────────────────────────────
import Survivor      from './scenes/Survivor';
import Certificate   from './scenes/Certificate';
import FinalGreeting from './scenes/FinalGreeting';

// ── Global components ─────────────────────────────────────────
import AnomalousSpider from './components/AnomalousSpider';
import SoundToggle     from './components/SoundToggle';

import './App.css';

const TRANSITION = 700;

export default function App() {
  const [state, setState]      = useState(INITIAL_STATE);
  const [transitioning, setTr] = useState(false);
  const trTimer                = useRef(null);

  // ── Navigate ──────────────────────────────────────────────
  const navigate = useCallback((scene, updates = {}) => {
    if (transitioning) return;
    setTr(true);
    clearTimeout(trTimer.current);
    trTimer.current = setTimeout(() => {
      setState(prev => ({ ...prev, scene, ...updates }));
      setTr(false);
    }, TRANSITION);
  }, [transitioning]);

  // ── Update player profile ─────────────────────────────────
  const updatePlayer = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      player: { ...prev.player, ...updates },
    }));
  }, []);

  // ── Update arcade state ───────────────────────────────────
  const updateArcade = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      arcade: { ...prev.arcade, ...updates },
    }));
  }, []);

  // ── Sound toggle ──────────────────────────────────────────
  const handleSoundToggle = useCallback((val) => {
    setState(prev => ({ ...prev, soundEnabled: val }));
    audioManager.setEnabled(val);
  }, []);

  // ── Full restart ──────────────────────────────────────────
  const handleRestart = useCallback(() => {
    clearTimeout(trTimer.current);
    setTr(false);
    audioManager.setEnabled(false);
    setState(INITIAL_STATE);
  }, []);

  const { scene, route, player, progress, arcade, soundEnabled } = state;
  const currentLevel = progress.currentLevel;

  // ── Level 1–3 continue handler ────────────────────────────
  const handleLevelContinue = useCallback(() => {
    const next = currentLevel + 1;
    if (next <= 3) {
      navigate(SCENES.LEVEL, {
        progress: { ...progress, currentLevel: next, highestLevel: next },
      });
    } else {
      // After Level 3 → Level 4 Arcade
      navigate(SCENES.LEVEL4_ARCADE, {
        progress: { ...progress, currentLevel: 4, highestLevel: 4 },
      });
    }
  }, [currentLevel, navigate, progress]);

  // ── Level 1–3 give up ─────────────────────────────────────
  const handleGiveUp = useCallback((level) => {
    navigate(SCENES.GIVE_UP, {
      progress: { ...progress, highestLevel: level },
    });
  }, [navigate, progress]);

  // ── Level 4 complete → Level 5 ───────────────────────────
  const handleArcadeComplete = useCallback(() => {
    navigate(SCENES.LEVEL5, {
      progress: { ...progress, currentLevel: 5, highestLevel: 5 },
    });
  }, [navigate, progress]);

  // ── Level 4 give up (mid-arcade) ─────────────────────────
  const handleArcadeGiveUp = useCallback(() => {
    navigate(SCENES.GIVE_UP, {
      progress: { ...progress, highestLevel: 4 },
    });
  }, [navigate, progress]);

  // ── Level 5 complete → Survivor ──────────────────────────
  const handleLevel5Complete = useCallback(() => {
    navigate(SCENES.SURVIVOR, {
      progress: { currentLevel: 5, highestLevel: 5, completed: true },
      timestamp: new Date().toISOString(),
    });
  }, [navigate]);

  // ── Spider visibility ─────────────────────────────────────
  const spiderVisible = route === 'trick' && [
    SCENES.LEVEL,
    SCENES.LEVEL4_ARCADE,
    SCENES.LEVEL5,
    SCENES.GIVE_UP,
    SCENES.SURVIVOR,
  ].includes(scene);
  const spiderIntensity = Math.min(5, currentLevel || 1);

  // ── Treat route: forward participant data ─────────────────
  // TreatRoute still uses 'participant' internally; we bridge through player
  const participantBridge = {
    name:          player.name,
    chocolate:     player.chocolate,
    quantity:      player.quantity,
    signature:     player.signature,
    agreedPromise: player.agreedPromise,
  };
  const updateParticipantBridge = useCallback((updates) => {
    updatePlayer(updates);
  }, [updatePlayer]);

  // ── GiveUp uses old 'participant' shape ───────────────────
  const participantForGiveUp = { name: player.name };

  return (
    <div className="app" aria-label="The Halloween Challenge">
      <SoundToggle enabled={soundEnabled} onToggle={handleSoundToggle} />
      <AnomalousSpider visible={spiderVisible} intensity={spiderIntensity} />

      {/* ── Opening ── */}
      {scene === SCENES.OPENING && (
        <Opening
          soundEnabled={soundEnabled}
          onComplete={() => navigate(SCENES.GREETING_CARD)}
        />
      )}

      {/* ── Greeting Card ── */}
      {scene === SCENES.GREETING_CARD && (
        <GreetingCard
          soundEnabled={soundEnabled}
          onComplete={() => navigate(SCENES.CHOICE)}
        />
      )}

      {/* ── Choice ── */}
      {scene === SCENES.CHOICE && (
        <ChoiceScreen
          soundEnabled={soundEnabled}
          onChooseTreat={() => navigate(SCENES.TREAT_INTRO, { route: 'treat' })}
          onChooseTrick={() => navigate(SCENES.TRICK_INTRO, { route: 'trick' })}
        />
      )}

      {/* ── Treat Route (unchanged) ── */}
      {(scene === SCENES.TREAT_INTRO ||
        scene === SCENES.TREAT_PROMISE ||
        scene === SCENES.TREAT_SEALED) && (
        <TreatRoute
          soundEnabled={soundEnabled}
          participant={participantBridge}
          onUpdateParticipant={updateParticipantBridge}
          onComplete={() => navigate(SCENES.FINAL_EXIT, {
            progress: { currentLevel: 0, highestLevel: 0, completed: true },
            timestamp: new Date().toISOString(),
          })}
        />
      )}

      {/* ── Trick Intro ── */}
      {scene === SCENES.TRICK_INTRO && (
        <TrickIntro
          soundEnabled={soundEnabled}
          onEnter={() => navigate(SCENES.LEVEL, {
            progress: { currentLevel: 1, highestLevel: 1, completed: false },
          })}
        />
      )}

      {/* ── Levels 1–3 ── */}
      {scene === SCENES.LEVEL && (
        <LevelShell
          key={`level-${currentLevel}`}
          levelNumber={currentLevel}
          player={player}
          soundEnabled={soundEnabled}
          onUpdatePlayer={updatePlayer}
          onContinue={handleLevelContinue}
          onGiveUp={handleGiveUp}
        />
      )}

      {/* ── Level 4 Arcade ── */}
      {scene === SCENES.LEVEL4_ARCADE && (
        <Level4Arcade
          arcade={arcade}
          player={player}
          soundEnabled={soundEnabled}
          onUpdateArcade={updateArcade}
          onUpdatePlayer={updatePlayer}
          onComplete={handleArcadeComplete}
          onFail={handleArcadeGiveUp}
          onGiveUp={handleArcadeGiveUp}
        />
      )}

      {/* ── Level 5 ── */}
      {scene === SCENES.LEVEL5 && (
        <Level5
          player={player}
          soundEnabled={soundEnabled}
          onUpdatePlayer={updatePlayer}
          onComplete={handleLevel5Complete}
        />
      )}

      {/* ── Give Up ── */}
      {scene === SCENES.GIVE_UP && (
        <GiveUp
          level={progress.highestLevel}
          participant={participantForGiveUp}
          onDone={() => navigate(SCENES.FINAL_EXIT)}
        />
      )}

      {/* ── Ultimate Survivor ── */}
      {scene === SCENES.SURVIVOR && (
        <Survivor
          participant={participantForGiveUp}
          soundEnabled={soundEnabled}
          onDone={() => navigate(SCENES.CERTIFICATE)}
        />
      )}

      {/* ── Certificate ── */}
      {scene === SCENES.CERTIFICATE && (
        <Certificate
          player={player}
          arcade={arcade}
          onDone={() => navigate(SCENES.FINAL_GREETING)}
        />
      )}

      {/* ── Final Greeting ── */}
      {scene === SCENES.FINAL_GREETING && (
        <FinalGreeting
          player={player}
          onExit={handleRestart}
        />
      )}

      {/* ── Final Exit (treat + give-up) ── */}
      {scene === SCENES.FINAL_EXIT && (
        <FinalExit
          participant={participantForGiveUp}
          route={route}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
