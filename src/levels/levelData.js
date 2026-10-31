// ──────────────────────────────────────────────────────────────
// LEVELS 1–3  (used by LevelShell)
// ──────────────────────────────────────────────────────────────
export const LEVELS = {
  1: {
    number:   '01',
    title:    'The Entrance',
    subtitle: 'Every story needs a name.',
    phase1: {
      atmosphere: [
        'Before you enter...',
        'Tell us who we should call.',
      ],
      inputLabel:  'What should we call you?',
      inputType:   'text',
      placeholder: 'Your name...',
      maxLength:   60,
      field:       'name',
    },
    phase2: {
      prompt: 'When you face something unknown, what do you usually do?',
      choices: [
        { key: 'A', label: 'Investigate it immediately.', value: 'INVESTIGATOR' },
        { key: 'B', label: 'Stay back and observe.',      value: 'OBSERVER'     },
        { key: 'C', label: 'Look for someone to help.',   value: 'SOCIAL'       },
        { key: 'D', label: 'Walk away.',                  value: 'CAUTIOUS'     },
      ],
      field: 'riskStyle',
    },
    doorOpen:    true,
    postMessage: 'Now I know what to call you.',
    spiderNote:  'Something watches from the corner.',
    completionText: ['Interesting.', "You've entered."],
  },
  2: {
    number:   '02',
    title:    'The Signal',
    subtitle: 'A distorted frequency. Your name on repeat.',
    phase1: {
      atmosphere: [
        'The signal keeps repeating your name.',
        'How old are you?',
      ],
      inputLabel:  'Your Age',
      inputType:   'number',
      placeholder: 'Age...',
      maxLength:   3,
      field:       'age',
    },
    phase2: {
      prompt: 'Something in this room doesn\'t belong. What do you notice first?',
      roomItems: [
        'A clock frozen at 02:17',
        'An old photograph turned face-down',
        'The window — open despite the cold',
        'A radio playing a station that doesn\'t exist',
      ],
      choices: [
        { key: 'A', label: 'The clock.',       value: 'TIME'        },
        { key: 'B', label: 'The photograph.',  value: 'MEMORY'      },
        { key: 'C', label: 'The window.',      value: 'ENVIRONMENT' },
        { key: 'D', label: 'The radio.',       value: 'SOUND'       },
      ],
      field: 'observationStyle',
    },
    postMessage: 'You notice more than you think.',
    spiderNote:  'The eye does not blink.',
  },
  3: {
    number:   '03',
    title:    'The Fear',
    subtitle: 'Everyone has something they don\'t want to face.',
    phase1: {
      atmosphere: [
        'Everyone has something they don\'t want to face.',
        'What are you most afraid of?',
      ],
      inputType:   'fear-picker',
      categories: [
        'Being alone',
        'Losing someone',
        'Failure',
        'Darkness',
        'Heights',
        'Unknown things',
        'Being watched',
        'Other',
      ],
      field: 'fear',
    },
    phase2: {
      prompt: 'If your fear appeared in front of you right now, what would you do?',
      choices: [
        { key: 'A', label: 'Face it.'                 },
        { key: 'B', label: 'Run.'                     },
        { key: 'C', label: 'Freeze.'                  },
        { key: 'D', label: 'Try to understand it.'    },
        { key: 'E', label: "Pretend it isn't there."  },
      ],
      field: 'fearResponse',
    },
    postMessage:  'Your answer has been recorded.',
    transition:   "Let's see if you meant it.",
    completionLines: [
      "You've told us your name.",
      "You've shown us how you think.",
      "And now...",
      "You've told us what scares you.",
      "",
      "Let's see what you do when the choices become real.",
    ],
    spiderNote: 'The spider pauses. It remembers.',
  },
};

// ──────────────────────────────────────────────────────────────
// CHARACTER SELECTION  (Level 4)
// ──────────────────────────────────────────────────────────────
export const CHARACTERS = [
  { id: 'gamer',        icon: '🎮', label: 'Gamer',        hint: 'Pattern recognition.' },
  { id: 'photographer', icon: '📸', label: 'Photographer', hint: 'Visual inconsistency.' },
  { id: 'musician',     icon: '🎸', label: 'Musician',     hint: 'Sound recognition.' },
  { id: 'programmer',   icon: '💻', label: 'Programmer',   hint: 'Logical sequences.' },
  { id: 'artist',       icon: '🎨', label: 'Artist',       hint: 'Visual details.' },
  { id: 'athlete',      icon: '🏃', label: 'Athlete',      hint: 'Risk and survival.' },
  { id: 'reader',       icon: '📚', label: 'Reader',       hint: 'Narrative patterns.' },
];

// ──────────────────────────────────────────────────────────────
// LEVEL 4 — THE NIGHT SHIFT
// 3 cases × 4 decisions = 12 total
// ──────────────────────────────────────────────────────────────
export const CASES = [
  // ─────────────────────────────────────────────────────────
  // CASE 01 — THE HOUSE AT 2:17
  // ─────────────────────────────────────────────────────────
  {
    id:       'house',
    number:   '01',
    title:    'The House at 2:17',
    theme:    'Investigation / Survival / Observation',
    opening: [
      '2:17 AM.',
      'Three knocks come from the bedroom door.',
      'A note was slipped under it earlier:',
      '',
      '"DO NOT OPEN THE DOOR."',
    ],
    decisions: [
      {
        id:        'h1',
        story:     'Muddy footprints lead toward the locked room — not away from it.\n\nThe front door has been locked from the inside.\n\nSomething came in. Nothing has left.',
        question:  'What do you examine first?',
        choices: [
          { key: 'A', label: 'Follow the muddy footprints.' },
          { key: 'B', label: 'Check if the front door is really locked.' },
          { key: 'C', label: 'Look for another exit.' },
          { key: 'D', label: 'Call for help immediately.' },
        ],
        correct:     'A',
        correctText: 'The footprints lead to a window latch — unlatched from inside. Someone was already here.',
        wrongText:   'You miss the detail. Time passes. The footprints dry.',
        evidence:    { id: 'muddy-prints', label: 'Muddy Footprints', detail: 'Footprints lead inward. Nothing left.' },
        hint:        { investigator: 'Follow the trail — it always leads somewhere.' },
      },
      {
        id:        'h2',
        story:     'The clock on the wall reads 2:17.\n\nIt has been 2:17 for the past three hours.\n\nYou remember seeing the same time when you arrived.',
        question:  'What does the stopped clock tell you?',
        choices: [
          { key: 'A', label: 'The power was cut at 2:17.' },
          { key: 'B', label: 'It\'s just a broken clock. Move on.' },
          { key: 'C', label: 'Someone deliberately stopped it.' },
          { key: 'D', label: 'Check the clock for a hidden compartment.' },
        ],
        correct:     'C',
        correctText: 'The clock has been manually stopped. The hands are bent, not wound down.',
        wrongText:   'You accept the coincidence. Some clues only matter when you realize it\'s too late.',
        evidence:    { id: 'stopped-clock', label: 'Stopped Clock', detail: 'Manually stopped. Hands bent at 2:17.' },
        hint:        { observer: 'You noticed the clock first. Trust that instinct.' },
      },
      {
        id:        'h3',
        story:     'Behind the photograph on the wall — different from the rest.\n\nThe face in it doesn\'t match anyone in the house.\n\nOn the back: a date. Three years ago.',
        question:  'What do you do with the photograph?',
        choices: [
          { key: 'A', label: 'Leave it. Photographs aren\'t clues.' },
          { key: 'B', label: 'Photograph it and compare to others.' },
          { key: 'C', label: 'Remove it from the wall.' },
          { key: 'D', label: 'Check what\'s behind it on the wall.' },
        ],
        correct:     'D',
        correctText: 'Behind the photograph: a small cut in the drywall. A folded piece of paper. A name.',
        wrongText:   'The photograph stays on the wall. Something stays hidden.',
        evidence:    { id: 'photograph', label: 'Hidden Photograph', detail: 'Unknown face. A note concealed behind it.' },
        hint:        { photographer: 'Photographers know — the frame matters as much as the subject.' },
      },
      {
        id:        'h4',
        story:     'Three knocks again.\n\nThen silence.\n\nThen one more knock — slower. Different.',
        question:  'The last knock was different. What do you do?',
        choices: [
          { key: 'A', label: 'Open the door. You\'ve gathered enough.' },
          { key: 'B', label: 'Speak through the door.' },
          { key: 'C', label: 'Record the sound.' },
          { key: 'D', label: 'Move away from the door and wait.' },
        ],
        correct:     'B',
        correctText: '"Is anyone there?"\n\nSilence.\n\nThen a voice: "You shouldn\'t have come back."\n\nBut you\'ve never been here before.',
        wrongText:   'You hesitate. The moment passes. The knocking stops forever.',
        evidence:    { id: 'voice', label: 'The Voice', detail: '"You shouldn\'t have come back."' },
        hint:        { social: 'Communication changes everything — even with the unknown.' },
      },
    ],
    completionText: 'CASE 01 SOLVED.\n\nThe house remembers everyone who entered.',
    survival: {
      prompt: 'The bedroom door begins to open. What do you do?',
      choices: [
        { key: 'A', label: 'Stay behind the overturned table.', costsLife: false, result: 'The figure crosses the room without seeing you.' },
        { key: 'B', label: 'Run for the open doorway.', costsLife: true, result: 'You escape, but something catches your arm. You lose one life.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // CASE 02 — THE LAST PHOTOGRAPH
  // ─────────────────────────────────────────────────────────
  {
    id:       'photograph',
    number:   '02',
    title:    'The Last Photograph',
    theme:    'Visual Deduction / Time / Prediction',
    opening: [
      'An abandoned photography studio.',
      'Every photograph shows something that hasn\'t happened yet.',
      'One photograph shows this room.',
      '',
      'You are in it.',
    ],
    decisions: [
      {
        id:        'p1',
        story:     'The camera on the tripod is still warm.\n\nA photograph develops in the tray.\n\nIt shows you — but the clock on the wall reads 2:34.\n\nThe clock on the wall currently reads 2:29.',
        question:  'What does the photograph of you tell you?',
        choices: [
          { key: 'A', label: 'Something will happen to you in five minutes.' },
          { key: 'B', label: 'The photograph is a trick.' },
          { key: 'C', label: 'The clock in the photograph is wrong.' },
          { key: 'D', label: 'Leave immediately.' },
        ],
        correct:     'A',
        correctText: 'You have five minutes. In the photograph you\'re standing at the window.\n\nYou move to the window. You see it — a car, parked with no lights on.',
        wrongText:   'Five minutes pass. The photograph was right. You were not.',
        evidence:    { id: 'photo-future', label: 'Future Photograph', detail: 'Photograph shows +5 minutes. Car outside.' },
        hint:        { gamer: 'Five minutes. You\'ve solved faster.' },
      },
      {
        id:        'p2',
        story:     'A series of photographs on the wall.\n\nSame room. Different objects each time.\n\nIn every photograph — one object is missing compared to the next.',
        question:  'What is missing from the sequence?',
        choices: [
          { key: 'A', label: 'A chair that appears then disappears.' },
          { key: 'B', label: 'A mirror that reflects a different room.' },
          { key: 'C', label: 'A person standing in the doorway.' },
          { key: 'D', label: 'The tripod — it\'s in all photos except one.' },
        ],
        correct:     'C',
        correctText: 'In photograph 4 — barely visible — a person in the doorway.\n\nAll other photographs: the doorway is empty.',
        wrongText:   'You miss the person. They have been watching across every photograph.',
        evidence:    { id: 'figure-doorway', label: 'Figure in Doorway', detail: 'Appears in photograph 4 only.' },
        hint:        { artist: 'Artists see the background first.' },
      },
      {
        id:        'p3',
        story:     'The developing tray contains three photographs.\n\nOne shows this room.\n\nOne shows a street.\n\nOne shows a face — partially obscured.',
        question:  'Which photograph matters most right now?',
        choices: [
          { key: 'A', label: 'The room — it tells you what\'s about to change.' },
          { key: 'B', label: 'The street — it shows the way out.' },
          { key: 'C', label: 'The face — identify the person.' },
          { key: 'D', label: 'Take all three and leave.' },
        ],
        correct:     'B',
        correctText: 'The street photograph shows a specific door — already open.\n\nAnd footprints leading away from the studio.',
        wrongText:   'You focus on the room. The exit closes.',
        evidence:    { id: 'street-exit', label: 'Exit Photograph', detail: 'Open door. Footprints leading away.' },
        hint:        { reader: 'Every story has an exit. You just have to find the right chapter.' },
      },
      {
        id:        'p4',
        story:     'The final photograph develops.\n\nIt shows this room.\n\nWith nobody in it.\n\nBut you are still here.',
        question:  'The photograph shows an empty room. You are still in it. What is the correct interpretation?',
        choices: [
          { key: 'A', label: 'The camera can\'t see you — you\'re safe.' },
          { key: 'B', label: 'You will leave before the photograph was taken.' },
          { key: 'C', label: 'The photograph is from the past — the room was empty before you arrived.' },
          { key: 'D', label: 'Something removed you from the photograph.' },
        ],
        correct:     'B',
        correctText: 'The photograph was taken from the future.\n\nYou leave before it happens.\n\nBecause you understand: the timeline bends toward the exit.',
        wrongText:   'You stay. The photograph was right. The room becomes empty.',
        evidence:    { id: 'empty-room', label: 'Empty Room Photo', detail: 'Future photo. You must leave before it.' },
        hint:        { programmer: 'If the function returns empty, the input never existed.' },
      },
    ],
    completionText: 'CASE 02 SOLVED.\n\nYou left before the photograph could be right.',
    survival: {
      prompt: 'A camera flash erupts in the darkroom. What do you do?',
      choices: [
        { key: 'A', label: 'Cover the lens and stay still.', costsLife: false, result: 'The flash dies. The figure in the doorway moves on.' },
        { key: 'B', label: 'Follow the light into the corridor.', costsLife: true, result: 'The corridor was a trap. You get away, but lose one life.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  // CASE 03 — THE CALLER
  // ─────────────────────────────────────────────────────────
  {
    id:       'caller',
    number:   '03',
    title:    'The Caller',
    theme:    'Psychological Manipulation / Trust / Deduction',
    opening: [
      'An old phone rings.',
      '',
      'You answer.',
      '',
      '"You have twelve minutes."',
      '"Some of what I tell you is true."',
      '"Some of it is not."',
      '"Your job is to know which is which."',
    ],
    decisions: [
      {
        id:        'c1',
        story:     'The caller says:\n\n"There are two exits. The left one is safe. But I\'m telling you the right one is safe."\n\nPause.\n\n"Did you hear what I just said?"',
        question:  'The caller contradicted themselves. What do you do?',
        choices: [
          { key: 'A', label: 'Trust the caller. Take the right exit.' },
          { key: 'B', label: 'They said left is safe, then said right. Take left.' },
          { key: 'C', label: 'Neither exit. Find another way.' },
          { key: 'D', label: 'Ask the caller to clarify.' },
        ],
        correct:     'B',
        correctText: 'The contradiction was the clue.\n\nThey told the truth first.\n\nThen lied.\n\nLeft was always the answer.',
        wrongText:   'You missed the structure of the deception. The first statement was always the truth.',
        evidence:    { id: 'contradiction', label: 'Caller Contradiction', detail: 'First statement = truth. Second = lie.' },
        hint:        { musician: 'Listen to the first note. The rest is variation.' },
      },
      {
        id:        'c2',
        story:     '"Three people know where you are," the caller says.\n\n"One of them sent me."\n\n"One of them doesn\'t know I\'m calling."\n\n"One of them is in this building with you."',
        question:  'Which statement should concern you most right now?',
        choices: [
          { key: 'A', label: 'The one who sent the caller — they have a motive.' },
          { key: 'B', label: 'The one who doesn\'t know — they might help.' },
          { key: 'C', label: 'The one in this building — that\'s the immediate threat.' },
          { key: 'D', label: 'None of it. The caller is bluffing.' },
        ],
        correct:     'C',
        correctText: 'Someone is in the building.\n\nYou move toward the stairs — and hear breathing from the floor above.',
        wrongText:   'You analyze the wrong variable. The threat is already here.',
        evidence:    { id: 'someone-inside', label: 'Someone Inside', detail: 'Breathing from floor above.' },
        hint:        { athlete: 'Prioritize the immediate. Philosophy later.' },
      },
      {
        id:        'c3',
        story:     '"I\'m going to give you three facts," the caller says.\n\n"Fact one: the door on your left has been unlocked for seven minutes."\n\n"Fact two: the lights will go out in four minutes."\n\n"Fact three: I\'ve been watching you for nine minutes."',
        question:  'Which fact contains a detectable lie?',
        choices: [
          { key: 'A', label: 'Fact one — how would they know when the door was unlocked?' },
          { key: 'B', label: 'Fact two — they can\'t predict the power.' },
          { key: 'C', label: 'Fact three — they\'ve been watching for nine minutes but you\'ve been here eleven.' },
          { key: 'D', label: 'All three could be true.' },
        ],
        correct:     'C',
        correctText: 'You\'ve been here eleven minutes.\n\nIf they\'ve been watching nine minutes — they missed the first two.\n\nThey didn\'t see you enter.',
        wrongText:   'The timeline inconsistency slips past. Some lies only work if you don\'t count backwards.',
        evidence:    { id: 'timeline', label: 'Timeline Discrepancy', detail: 'Caller missed first 2 minutes. Didn\'t see entry.' },
        hint:        { programmer: 'Check the timestamps. They never lie.' },
      },
      {
        id:        'c4',
        story:     '"Last question," the caller says.\n\n"Everything I\'ve told you tonight — was it to help you or harm you?"\n\nPause.\n\n"Answer correctly and the door opens."\n\n"Answer incorrectly and I call again tomorrow."',
        question:  'Was the caller trying to help you or harm you?',
        choices: [
          { key: 'A', label: 'Harm me — they gave me false information.' },
          { key: 'B', label: 'Help me — every clue they gave was accurate.' },
          { key: 'C', label: 'Neither — they were testing me.' },
          { key: 'D', label: 'Both — some truths, some lies, all intentional.' },
        ],
        correct:     'D',
        correctText: 'The caller was both.\n\nEvery truth was placed to test your reasoning.\n\nEvery lie was placed to reveal your assumptions.\n\nYou passed.',
        wrongText:   'You oversimplify the motive.\n\nThe caller will call again tomorrow.',
        evidence:    { id: 'caller-motive', label: 'Caller Motive', detail: 'Both help and harm. All intentional.' },
        hint:        { reader: 'The best antagonists always believe they\'re the protagonist.' },
      },
    ],
    completionText: 'CASE 03 SOLVED.\n\nYou understood the caller before the call ended.',
    survival: {
      prompt: 'The phone rings again from the room behind you. What do you do?',
      choices: [
        { key: 'A', label: 'Leave it unanswered and head for the exit.', costsLife: false, result: 'The ringing stops before you reach the door.' },
        { key: 'B', label: 'Answer and ask who is calling.', costsLife: true, result: 'A hand closes around the receiver, then your wrist. You escape, but lose one life.' },
      ],
    },
  },
];

// ──────────────────────────────────────────────────────────────
// LEVEL 5 — THE FINAL NIGHTMARE  (standalone scene)
// ──────────────────────────────────────────────────────────────
export const LEVEL5 = {
  number:   '05',
  title:    'The Final Nightmare',
  subtitle: 'Only the truth remains.',
  atmosphere: [
    "You've survived everyone else's nightmare.",
    'Now...',
    'Tell us yours.',
  ],
  inputLabel:   'What is your worst nightmare?',
  placeholder:  'Describe your worst nightmare... (optional)',
  maxLength:    1000,
  optional:     true,
  postMessage:  'I hope you never experience it.',
  finalMessage: 'You survived.',
};
