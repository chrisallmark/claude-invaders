# Claude Invaders

A browser recreation of the classic 1978 arcade game **Space Invaders**, built with Next.js and TypeScript, where the alien sprites are redesigned as Claude-branded pixel-art characters. The rest of the game — player cannon, mystery UFO, destructible bunkers, HUD, and the monochrome/green CRT look — stays faithful to the original arcade's proportions and feel.

Everything is rendered on a single `<canvas>` from hand-authored pixel bitmaps defined in code — there are no image assets.

## Controls

| Action | Keyboard          | Touch                    |
| ------ | ----------------- | ------------------------- |
| Move   | Arrow keys / A, D | ◀ / ▶ on-screen buttons   |
| Fire   | Space             | ● on-screen button        |

Press fire on the title screen to start. On game over, press fire again to return to the title screen.

## Gameplay

- Classic wave loop: a 5×11 grid of aliens marches in lock-step, speeding up as fewer remain and dropping a row closer each time it hits a screen edge. Clearing a wave spawns a new, faster one.
- 3 destructible bunkers erode where they're hit (by either side) and let bullets tunnel through existing holes.
- A mystery UFO crosses the top periodically for a random bonus (50/100/150/300 points).
- 3 lives, a bonus life at 1500 points, and a persisted high score (stored in your browser's `localStorage`).
- Game over when you run out of lives or the alien formation reaches your row.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Scripts

| Script            | Purpose                          |
| ------------------ | --------------------------------- |
| `pnpm dev`         | Run the app locally in dev mode   |
| `pnpm build`       | Production build                  |
| `pnpm start`       | Serve the production build        |
| `pnpm lint`        | ESLint                             |
| `pnpm typecheck`   | TypeScript, no emit                |
| `pnpm test`        | Vitest (collision + wave math)     |

## Deployment

This is a standard Next.js App Router project with no server-side requirements — it builds to a fully static page and deploys to [Vercel](https://vercel.com) with zero extra configuration.

## Credits

- Original game design: Tomohiro Nishikado / Taito (1978).
- Arcade sound effects sourced from a personal archive of the classic 9-sample set (UFO, shoot, explosion, invader-killed, 4-step march, extend-play).
- Alien character art and "Claude Invaders" theming created for this project.
