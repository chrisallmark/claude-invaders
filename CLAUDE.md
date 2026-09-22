@AGENTS.md

# Claude Invaders

A browser recreation of Space Invaders (Next.js App Router + TypeScript) with Claude-branded alien sprites. Everything except the 3 alien tiers should stay faithful to the original arcade's proportions/behavior; the aliens are custom Claude-themed pixel art in the same bounding boxes.

## Conventions

- Package manager: **pnpm**. No Husky/commitlint/semantic-release/Playwright — deliberately lightweight tooling for a single-developer hobby project. Don't add CI/release ceremony without being asked.
- TypeScript `strict: true`, `@/*` → `./src/*` alias.
- **Version control is local-only.** This repo's remote lives outside the Vodafone-approved GitHub org, so pushes/deploys are done manually by the repo owner — never run `git push`, create the GitHub repo, or perform any GitHub-remote action from an agent session here.
- No image assets. All sprites are hand-authored in-code pixel bitmaps (2D arrays), not external files — see the sprites plan below once it lands.

## Architecture (fills in as tiers land)

- Game state lives in a plain `GameEngine` class driven by `requestAnimationFrame`, not React state — React only mounts the canvas, touch controls, and rare DOM overlays (e.g. "tap to start" for audio unlock). HUD/menus are canvas-drawn with a bitmap font.
- Planned module layout: `src/game/{engine,constants,types,input,audio,storage,collision,waves}.ts`, `src/game/entities/{player,aliens,bullets,ufo,bunkers,explosions}.ts`, `src/game/sprites/{index,arcade,claudeAliens}.ts`, `src/components/{GameShell,TouchControls,HighScoreBadge}.tsx`.
- Sound: 9 classic arcade WAV samples live in `public/sounds/`, played via the Web Audio API.

## Useful scripts

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck` (and `pnpm test` once Vitest is added in a later tier).
