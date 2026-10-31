// ── Scene identifiers ──────────────────────────────────────────
export const SCENES = {
  OPENING:        'opening',
  GREETING_CARD:  'greeting-card',
  CHOICE:         'choice',
  TREAT_INTRO:    'treat-intro',
  TREAT_PROMISE:  'treat-promise',
  TREAT_SEALED:   'treat-sealed',
  TRICK_INTRO:    'trick-intro',
  LEVEL:          'level',        // Levels 1–3 via LevelShell
  LEVEL4_ARCADE:  'level4-arcade',// New: full adventure arcade
  LEVEL5:         'level5',       // New: dedicated final nightmare
  GIVE_UP:        'give-up',
  SURVIVOR:       'survivor',
  CERTIFICATE:    'certificate',
  FINAL_GREETING: 'final-greeting',
  FINAL_EXIT:     'final-exit',
};

// ── Player profile (full session) ─────────────────────────────
export const INITIAL_PLAYER = {
  name:              '',
  age:               '',
  riskStyle:         null,   // 'INVESTIGATOR'|'OBSERVER'|'SOCIAL'|'CAUTIOUS'
  observationStyle:  null,   // 'TIME'|'MEMORY'|'ENVIRONMENT'|'SOUND'
  fear:              '',
  fearCategory:      null,   // preset category or 'other'
  fearResponse:      null,   // 'A'–'E'
  character:         null,   // gamer|photographer|musician|programmer|artist|athlete|reader
  level4Decisions:   [],     // array of {caseId, decisionId, choice, correct}
  nightmare:         '',
  // treat-only
  chocolate:         '',
  quantity:          '',
  signature:         '',
  agreedPromise:     false,
};

// ── Initial session state ──────────────────────────────────────
export const INITIAL_STATE = {
  scene:         SCENES.OPENING,
  route:         null,           // 'treat' | 'trick'
  player:        { ...INITIAL_PLAYER },
  progress: {
    currentLevel:  0,
    highestLevel:  0,
    completed:     false,
  },
  // Level 4 arcade state
  arcade: {
    lives:           3,
    currentCase:     0,          // 0-indexed
    currentDecision: 0,          // within case
    evidence:        [],         // collected evidence ids
    caseResults:     [],         // {caseId, solved}
    survivalEvents:  [],         // {caseId, survived}
    failed:          false,
  },
  reward:        null,
  timestamp:     null,
  soundEnabled:  false,
};

// ── Risk style flavor text (influences level 4 narration) ──────
export const RISK_FLAVOR = {
  INVESTIGATOR: 'You seem like the type who opens doors others leave locked.',
  OBSERVER:     'You notice things before you act.',
  SOCIAL:       'You trust people more than places.',
  CAUTIOUS:     'You survive by knowing when not to move.',
};
