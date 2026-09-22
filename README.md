# Claude Invaders

A browser recreation of the classic 1978 arcade game **Space Invaders**, built with Next.js and TypeScript, where the alien sprites are redesigned as Claude-branded pixel-art characters. The rest of the game — player cannon, mystery UFO, destructible bunkers, HUD, and the monochrome/green CRT look — stays faithful to the original arcade proportions and feel.

**Status: Tier 0 (scaffold)** — the framework is set up but the game itself hasn't been built yet. This section will be filled in with controls, gameplay notes, and credits as development progresses through the build tiers.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Scripts

| Script            | Purpose                          |
| ------------------ | --------------------------------- |
| `pnpm dev`         | Run the app locally in dev mode   |
| `pnpm build`       | Production build                  |
| `pnpm start`       | Serve the production build        |
| `pnpm lint`        | ESLint                             |
| `pnpm typecheck`   | TypeScript, no emit                |

## Deployment

This is a standard Next.js App Router project with no server-side requirements — it deploys to [Vercel](https://vercel.com) with zero extra configuration.

## Credits

- Original game design: Tomohiro Nishikado / Taito (1978).
- Arcade sound effects sourced from a personal archive of the classic sample set.
- Alien character art and "Claude Invaders" theming created for this project.
