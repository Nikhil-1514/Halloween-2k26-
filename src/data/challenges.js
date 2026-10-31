// ============================================================
// Spooky Challenges — add / remove entries freely
// ============================================================
export const challenges = [
  {
    id: 1,
    text: "Turn off ALL the lights and sit in the dark for 30 seconds. No peeking.",
    hasTimer: true,
    duration: 30,
    timerLabel: "seconds of darkness",
  },
  {
    id: 2,
    text: "Look behind you. Right now. Slowly.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 3,
    text: "Send Nikhil the scariest selfie you can make right now.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 4,
    text: "Make your best ghost sound — loud enough for the room to hear.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 5,
    text: "Walk around your room like a zombie for 20 full seconds. No shortcuts.",
    hasTimer: true,
    duration: 20,
    timerLabel: "seconds of shambling",
  },
  {
    id: 6,
    text: "Find the scariest GIF you can and send it to Nikhil immediately.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 7,
    text: 'Stand in front of a mirror and say "I am not afraid" three times. Out loud. Mean it.',
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 8,
    text: "Let someone nearby choose your Halloween profile picture for the next 10 minutes.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 9,
    text: "Tell Nikhil your scariest real-life story. Right now. No skipping.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 10,
    text: "Survive 30 seconds without checking behind you. The timer starts now.",
    hasTimer: true,
    duration: 30,
    timerLabel: "seconds of courage",
  },
  {
    id: 11,
    text: "Knock on your closet door three times and wait 5 seconds for a response.",
    hasTimer: true,
    duration: 5,
    timerLabel: "seconds of waiting",
  },
  {
    id: 12,
    text: "Type your deepest Halloween fear in the group chat. No edits allowed.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 13,
    text: "Hold your breath for as long as you can. If it's under 15 seconds... the ghosts judge you.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
  {
    id: 14,
    text: "Close your eyes and describe exactly what you imagine is standing behind you right now.",
    hasTimer: false,
    duration: null,
    timerLabel: null,
  },
];

export const getRandomChallenge = () => {
  const idx = Math.floor(Math.random() * challenges.length);
  return challenges[idx];
};
