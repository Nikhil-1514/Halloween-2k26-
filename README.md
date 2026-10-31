# 🎃 Nikhil's Haunted Halloween

> An interactive Halloween mini-game. Choose your fate: Treat or Trick?

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Nikhil-1514/Halloween-2k26-)

---

## Features

- 🎬 **Cinematic intro** with spooky flickering text and skip option
- 🍫 **Treat flow** — pay the chocolate tax and escape safely
- 👻 **Trick flow** — face a random spooky challenge with optional countdown timer
- 💥 **Fake jumpscare** — harmless ghost silhouette surprise (45% chance, skippable)
- 🌕 **Easter eggs** — click the moon, find the secret pumpkin, type HALLOWEEN
- 🔊 **Web Audio ambient sound** — toggle on/off, never autoplays
- ✨ **Animated background** — moon, bats, particles, fog, stars, candles, spider webs
- 📱 **Mobile-first responsive** — tested at 360px → 1440px
- ♿ **Accessible** — keyboard navigation, focus states, reduced-motion support
- 🚀 **Static deployment** — no backend, no API keys, no database

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Language | JavaScript (ES Modules) |
| Styling | Vanilla CSS + CSS Animations |
| Icons | Lucide React |
| Audio | Web Audio API (no external files) |
| Deployment | Vercel / Netlify / GitHub Pages |

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/Nikhil-1514/Halloween-2k26-
cd Halloween-2k26-

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Production Build

```bash
npm run build
```

Output goes to `dist/`. Preview it locally:

```bash
npm run preview
```

---

## Deploy to Vercel (Recommended)

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Option B — GitHub Integration

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Vite — no config needed
5. Deploy

> The included `vercel.json` handles SPA routing automatically.

---

## Deploy to Netlify

1. Run `npm run build`
2. Drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

Or connect via GitHub and set build command to `npm run build` and publish directory to `dist`.

---

## Deploy to GitHub Pages

```bash
npm install -D gh-pages
```

Add to `package.json`:
```json
"homepage": "https://Nikhil-1514.github.io/Halloween-2k26-",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Then:
```bash
npm run deploy
```

---

## Customisation

### Change the host name

Edit [`src/config/halloweenConfig.js`](./src/config/halloweenConfig.js):

```js
export const halloweenConfig = {
  hostName: "Nikhil",   // ← Change this
  chocolateCount: 1,
  year: 2026,
};
```

### Add or remove challenges

Edit [`src/data/challenges.js`](./src/data/challenges.js):

```js
export const challenges = [
  {
    id: 15,
    text: "Your new challenge text here.",
    hasTimer: true,
    duration: 15,
    timerLabel: "seconds of terror",
  },
  // ...
];
```

Set `hasTimer: false` and `duration: null` for challenges without a countdown.

### Change Halloween messages

Edit [`src/data/spookyMessages.js`](./src/data/spookyMessages.js):

- `spookyIntros` — intro screen first-line messages
- `spookyFollowUps` — intro screen second-line messages
- `moonMessages` — easter egg moon click messages
- `pumpkinMessages` — secret pumpkin easter egg messages
- `awakenMessages` — HALLOWEEN keyboard sequence messages
- `ghostReactions.survived` — messages shown when player wins
- `ghostReactions.failed` — messages shown when player gives up

---

## Privacy

This site only exposes the host's first name. No personal information (email, phone, college, location, social media) is present anywhere in the source code, configuration, or metadata.

---

## License

MIT — use it, remix it, send it to your friends. Happy Halloween! 🎃
