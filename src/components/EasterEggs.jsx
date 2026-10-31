import { useEffect, useRef } from "react";
import { moonMessages, pumpkinMessages, awakenMessages, getRandomItem } from "../data/spookyMessages";

export default function EasterEggs({ active, onToast }) {
  const moonClicksRef = useRef(0);
  const keySequenceRef = useRef([]);
  const TARGET_SEQUENCE = "halloween".toUpperCase().split("");

  // Keyboard easter egg: type H-A-L-L-O-W-E-E-N
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toUpperCase();
      const seq = keySequenceRef.current;
      const next = TARGET_SEQUENCE[seq.length];

      if (key === next) {
        seq.push(key);
        if (seq.length === TARGET_SEQUENCE.length) {
          keySequenceRef.current = [];
          onToast(getRandomItem(awakenMessages), "awaken");
        }
      } else {
        keySequenceRef.current = key === TARGET_SEQUENCE[0] ? [key] : [];
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onToast]);

  return null; // Logic-only component; moon click handled via HauntedBackground prop
}

// Hook for moon click easter egg
export function useMoonEasterEgg(onToast) {
  const clicksRef = useRef(0);

  const handleMoonClick = () => {
    clicksRef.current += 1;
    const n = clicksRef.current;
    const msgs = moonMessages;
    if (n === 1) onToast(msgs[0], "moon");
    else if (n === 3) onToast(msgs[1], "moon");
    else if (n === 6) onToast(msgs[2], "moon");
    else if (n >= 9) {
      onToast(msgs[3], "moon");
      clicksRef.current = 0;
    }
  };

  return handleMoonClick;
}

// Pumpkin easter egg — called when secret pumpkin clicked
export function usePumpkinEasterEgg(onToast) {
  return () => onToast(getRandomItem(pumpkinMessages), "pumpkin");
}
