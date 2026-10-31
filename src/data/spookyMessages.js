// ============================================================
// Spooky Messages — randomised across the app
// ============================================================

export const jumpscareMessages = [
  "BOO.",
  "FOUND YOU.",
  "BEHIND YOU.",
  "SURPRISE.",
];

export const ghostReactions = {
  survived: [
    "The spirits... are impressed.",
    "Even the ghosts applaud you.",
    "The haunted house trembles with respect.",
    "You have proven yourself, mortal.",
    "The darkness bows before your courage.",
  ],
  failed: [
    "The ghosts weep. Or maybe they're laughing. Hard to tell.",
    "Somewhere, a skeleton is pointing at you.",
    "Cowardice has been noted in the Book of Shadows.",
    "Even the pumpkins are disappointed.",
    "The haunted house sighs deeply.",
  ],
};

export const spookyIntros = [
  "Something is watching...",
  "The candles flicker...",
  "A chill fills the air...",
  "The shadows shift...",
];

export const spookyFollowUps = [
  "Oh... you're here.",
  "We've been expecting you.",
  "The house remembers you.",
  "You came back.",
];

export const moonMessages = [
  "Stop staring at the moon.",
  "It noticed you.",
  "The moon doesn't appreciate the attention.",
  "Seriously. Stop. It's watching back.",
];

export const pumpkinMessages = [
  "🎃 You found the forbidden pumpkin.",
  "This pumpkin holds ancient secrets.",
  "The pumpkin acknowledges your curiosity.",
];

export const awakenMessages = [
  "THE HOUSE HAS AWAKENED.",
  "Something stirs in the darkness...",
  "All the candles just lit themselves.",
];

export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
