import { useEffect, useRef } from 'react';

/**
 * Lightweight hook for playing short sound effects using the Web Audio API.
 * No external audio files are required – simple oscillator tones are generated
 * on demand. This keeps the bundle size minimal and works offline.
 */
export function useSound() {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Create a single AudioContext for the lifetime of the app.
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playTone = (frequency, duration = 0.2, type = 'sine') => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.stop(ctx.currentTime + duration + 0.02);
  };

  return {
    click: () => playTone(300, 0.08, 'square'), // short click
    success: () => playTone(600, 0.2, 'triangle'), // success cue
    failure: () => playTone(150, 0.3, 'sawtooth'), // failure cue
    creepy: () => playTone(100, 0.4, 'sine'), // eerie low tone
  };
}
