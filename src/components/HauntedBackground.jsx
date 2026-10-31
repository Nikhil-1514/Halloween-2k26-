// No React imports needed — pure JSX component

// ─── Bat SVG ────────────────────────────────────────────────
const BatIcon = () => (
  <svg viewBox="0 0 60 30" fill="currentColor" aria-hidden="true">
    <path d="M30 10 C20 0, 0 5, 0 15 C8 10, 15 14, 20 18 C22 22, 26 24, 30 20 C34 24, 38 22, 40 18 C45 14, 52 10, 60 15 C60 5, 40 0, 30 10Z" />
    <ellipse cx="30" cy="18" rx="5" ry="4" />
    <circle cx="27" cy="15" r="1.5" fill="#1a0a2e" />
    <circle cx="33" cy="15" r="1.5" fill="#1a0a2e" />
  </svg>
);

// ─── Single Bat ──────────────────────────────────────────────
const Bat = ({ style }) => (
  <div className="bat" style={style} aria-hidden="true">
    <BatIcon />
  </div>
);

// ─── Floating Particle ───────────────────────────────────────
const Particle = ({ style }) => (
  <div className="particle" style={style} aria-hidden="true" />
);

// ─── Leaf ────────────────────────────────────────────────────
const Leaf = ({ style }) => (
  <div className="leaf" style={style} aria-hidden="true">
    🍂
  </div>
);

// ─── Spider Web ──────────────────────────────────────────────
const SpiderWeb = ({ corner = "tl" }) => (
  <svg
    className={`spider-web spider-web--${corner}`}
    viewBox="0 0 120 120"
    aria-hidden="true"
  >
    {/* Radial lines */}
    {[0, 30, 60, 90].map((angle) => (
      <line
        key={angle}
        x1="0"
        y1="0"
        x2={120 * Math.cos((angle * Math.PI) / 180)}
        y2={120 * Math.sin((angle * Math.PI) / 180)}
        stroke="rgba(200,200,200,0.25)"
        strokeWidth="0.8"
      />
    ))}
    {/* Concentric arcs */}
    {[25, 55, 85, 110].map((r) => (
      <path
        key={r}
        d={`M 0 ${r} Q ${r} 0 ${r} 0`}
        fill="none"
        stroke="rgba(200,200,200,0.18)"
        strokeWidth="0.8"
      />
    ))}
    <circle cx="0" cy="0" r="2.5" fill="rgba(200,200,200,0.3)" />
  </svg>
);

// ─── Moon ────────────────────────────────────────────────────
export const Moon = ({ onClick, glowing }) => (
  <button
    className={`moon${glowing ? " moon--glow" : ""}`}
    onClick={onClick}
    aria-label="Click the moon"
    type="button"
  >
    <div className="moon__body" aria-hidden="true">
      <div className="moon__crater moon__crater--1" />
      <div className="moon__crater moon__crater--2" />
      <div className="moon__crater moon__crater--3" />
    </div>
    <div className="moon__halo" aria-hidden="true" />
  </button>
);

// ─── Stars ───────────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60,
  size: Math.random() * 2 + 0.8,
  delay: Math.random() * 4,
  duration: 2 + Math.random() * 3,
}));

// ─── Bats config ─────────────────────────────────────────────
const BATS = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  top: `${8 + Math.random() * 30}%`,
  delay: `${i * 2.2 + Math.random() * 1.5}s`,
  duration: `${18 + Math.random() * 12}s`,
  size: `${24 + Math.random() * 20}px`,
  opacity: 0.55 + Math.random() * 0.4,
}));

// ─── Particles config ─────────────────────────────────────────
const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${6 + Math.random() * 10}s`,
  size: `${3 + Math.random() * 5}px`,
  color: i % 3 === 0 ? "#ff6b35" : i % 3 === 1 ? "#7c3aed" : "#39ff14",
}));

// ─── Leaves config ────────────────────────────────────────────
const LEAVES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${10 + Math.random() * 80}%`,
  delay: `${Math.random() * 12}s`,
  duration: `${8 + Math.random() * 8}s`,
}));

// ─── Main Background Component ───────────────────────────────
export default function HauntedBackground({ onMoonClick, moonGlowing }) {

  return (
    <div className="haunted-bg" aria-hidden="true">
      {/* Stars */}
      <div className="stars">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <Moon onClick={onMoonClick} glowing={moonGlowing} />

      {/* Spider webs */}
      <SpiderWeb corner="tl" />
      <SpiderWeb corner="tr" />

      {/* Bats */}
      {BATS.map((b) => (
        <Bat
          key={b.id}
          style={{
            top: b.top,
            animationDelay: b.delay,
            animationDuration: b.duration,
            width: b.size,
            opacity: b.opacity,
          }}
        />
      ))}

      {/* Particles */}
      {PARTICLES.map((p) => (
        <Particle
          key={p.id}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
        />
      ))}

      {/* Leaves */}
      {LEAVES.map((l) => (
        <Leaf
          key={l.id}
          style={{
            left: l.left,
            animationDelay: l.delay,
            animationDuration: l.duration,
          }}
        />
      ))}

      {/* Fog */}
      <div className="fog fog--1" />
      <div className="fog fog--2" />
      <div className="fog fog--3" />

      {/* Candle glow at bottom corners */}
      <div className="candle candle--left">
        <div className="candle__flame" />
        <div className="candle__body" />
      </div>
      <div className="candle candle--right">
        <div className="candle__flame" />
        <div className="candle__body" />
      </div>

      {/* Grain overlay */}
      <div className="grain" />
    </div>
  );
}
