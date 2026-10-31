// ── Reward definitions (single source of truth) ───────────────
export const REWARDS = {
  treat: {
    title:       'Promise Keeper',
    subtitle:    'The Chocolate Promise',
    description: 'A debt of chocolate now exists. The promise has been sealed and witnessed by the night.',
    badge:       '🍫',
    status:      'PROMISE SEALED',
    color:       'ember',
  },
  level1: {
    title:       'Level 1 Survivor',
    subtitle:    'The First Door',
    description: 'You showed your face to the darkness and then chose to leave. That alone is more than most.',
    badge:       '🚪',
    status:      'ESCAPED',
    color:       'fog',
  },
  level2: {
    title:       'Level 2 Survivor',
    subtitle:    'Seen by the Eye',
    description: 'Something ancient noticed you. You noticed it back. Then, wisely, you chose to leave.',
    badge:       '👁️',
    status:      'ESCAPED',
    color:       'fog',
  },
  level3: {
    title:       'Level 3 Survivor',
    subtitle:    'Fear Acknowledged',
    description: 'You named what haunts you. Then you walked away. The knowing stays with you.',
    badge:       '🌒',
    status:      'ESCAPED',
    color:       'fog',
  },
  level4: {
    title:       'Level 4 Survivor',
    subtitle:    'The House Remembers',
    description: 'You survived the witching hour inside the house. The door is still open. Something knows your name.',
    badge:       '🏚️',
    status:      'ESCAPED',
    color:       'blood',
  },
  ultimate: {
    title:       'ULTIMATE SURVIVOR',
    subtitle:    'All Five Levels Conquered',
    description: 'You faced everything the night had to offer. Your name is carved into the dark. The house has no power over you.',
    badge:       '👑',
    status:      'SURVIVED',
    color:       'gold',
  },
};

// Returns the appropriate reward for a given level (0 = treat route)
export function getReward(level) {
  if (level === 0)       return REWARDS.treat;
  if (level === 1)       return REWARDS.level1;
  if (level === 2)       return REWARDS.level2;
  if (level === 3)       return REWARDS.level3;
  if (level === 4)       return REWARDS.level4;
  if (level >= 5)        return REWARDS.ultimate;
  return REWARDS.level1;
}
