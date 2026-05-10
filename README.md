# Guerilla Intel

A single-page **tactical lineup reference** for Counter-Strike style play. Pick a competitive map, choose **T** or **CT**, narrow by utility type (smokes, flashes, molotovs, HE), then open a lineup for **step-by-step throw instructions**, difficulty, tick rate, and demo media—wrapped in a command-center style UI.

> Unofficial fan project: map names and layout concepts belong to Valve; imagery and placeholders in `src/data.ts` are for demonstration only.

## Features

- **Map hub** — Mirage, Inferno, Dust 2, Ancient, Anubis, Nuke, Vertigo with status cues (updated / outdated).
- **Filtered lineups** — Side (terrorist vs counter-terrorist) and utility tabs.
- **Detail view** — Origin → target, numbered procedure, GIF/video preview, bookmark-style “save” toggle (session only in the UI).
- **Motion + accessibility-minded layout** — Transitions via Motion, monospace tactical theme, Tailwind-powered styling.

## Tech stack

- [React](https://react.dev/) 19 · [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) 6
- [Tailwind CSS](https://tailwindcss.com/) 4 (`@tailwindcss/vite`)
- [Motion](https://motion.dev/) · [Lucide](https://lucide.dev/) icons

## Run locally

**Prerequisite:** Node.js 20+ recommended (LTS).

1. Install dependencies:

   ```bash
   npm install
   ```

2. **Optional.** If you extend the app with the [Gemini API](https://ai.google.dev/) (`@google/genai` is already in dependencies), copy environment variables from [`.env.example`](.env.example) into `.env.local` and set `GEMINI_API_KEY`. The current lineup browser runs without any API keys.

3. Start the dev server (listens on port **3000**):

   ```bash
   npm run dev
   ```

4. Production build:

   ```bash
   npm run build
   npm run preview
   ```

5. Typecheck:

   ```bash
   npm run lint
   ```

## Project layout

| Path | Role |
|------|------|
| [`src/App.tsx`](src/App.tsx) | Routes between map list → lineups → detail views |
| [`src/data.ts`](src/data.ts) | Maps and lineup records (titles, URLs, steps) |
| [`src/types.ts`](src/types.ts) | Shared TypeScript types |

Add or edit lineups by updating `MAPS` and `LINEUPS` in `src/data.ts`.

---

Scaffold history: this repo was bootstrapped from a Google AI Studio / Vite React template; the product focus is **Guerilla Intel** as described above.
