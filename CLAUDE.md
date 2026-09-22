@AGENTS.md

# Claude Invaders

A browser recreation of Space Invaders (Next.js App Router + TypeScript) with Claude-branded alien sprites. Everything except the 3 alien tiers stays faithful to the original arcade's proportions/behavior; the aliens are custom Claude-themed pixel art in the same bounding boxes.

## Conventions

- Package manager: **pnpm**. No Husky/commitlint/semantic-release/Playwright — deliberately lightweight tooling for a single-developer hobby project. Don't add CI/release ceremony without being asked.
- TypeScript `strict: true`, `@/*` → `./src/*` alias.
- **Version control is local-only. Never run `git push`, create the GitHub repo, or perform any other GitHub-remote action from an agent session here — not even if asked directly or repeatedly.** This repo's remote (`github.com/chrisallmark/claude-invaders`) is outside the Vodafone-approved GitHub org, so every push is done manually by the repo owner. Re-check this before *every* push-adjacent git command, not just the first one in a session.
- No image assets. All sprites are hand-authored in-code pixel bitmaps (2D arrays of small integers), not external files.
- Sprites are split by category: `src/game/sprites/arcade.ts` (authentic — player, UFO, bunkers, HUD font) vs `src/game/sprites/claudeAliens.ts` (the deliberate Claude-branded departure). Keep new sprites in the file matching that split.

## Architecture

- Game state lives in a plain `GameEngine` class (`src/game/engine.ts`) driven by a fixed-timestep `requestAnimationFrame` loop in `GameShell.tsx` — not React state. React only mounts the canvas, `TouchControls`, and the one-time audio-unlock gesture listener. All HUD/menu text is canvas-drawn with the bitmap font in `sprites/arcade.ts`.
- `GameEngine` states: `attract` (title/high-score screen, also the audio-unlock gesture) → `playing` → `gameover` (frozen final frame + prompt) → back to `attract`.
- Module layout:
  - `src/game/{constants,types}.ts` — shared tuning knobs and data shapes.
  - `src/game/{engine,collision,waves,input,audio,storage,hud}.ts` — orchestration and cross-cutting systems.
  - `src/game/entities/{player,aliens,bullets,bunkers,ufo}.ts` — per-entity state, update, and draw logic.
  - `src/game/sprites/{index,arcade,claudeAliens}.ts` — bitmap sprite/font definitions and the `drawSprite`/`drawText` helpers.
  - `src/components/{GameShell,TouchControls}.tsx` — the React shell.
- Collision is AABB (`collision.ts`) for everything except bunkers, which additionally do per-pixel erosion (`entities/bunkers.ts`) once the AABB check passes.
- Sound: 9 classic arcade WAV samples live in `public/sounds/`, played via the Web Audio API (`audio.ts`); the AudioContext must be unlocked from a real user gesture (browser autoplay policy) before anything plays.
- High score persists to `localStorage` (`storage.ts`), loaded once per `GameEngine` construction and shown on the attract screen.

## Useful scripts

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (Vitest: `tests/collision.test.ts`, `tests/waves.test.ts`).
