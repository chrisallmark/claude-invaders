import {
  ALIEN_COLS,
  ALIEN_DROP_DISTANCE,
  ALIEN_H_SPACING,
  ALIEN_PIXEL_SIZE,
  ALIEN_ROWS,
  ALIEN_SIDE_MARGIN,
  ALIEN_STEP_DISTANCE,
  ALIEN_TOP_MARGIN,
  ALIEN_V_SPACING,
  CANVAS_WIDTH,
  COLORS,
} from "@/game/constants";
import { drawSprite } from "@/game/sprites";
import { ALIEN_SPRITES, ALIEN_WIDTH } from "@/game/sprites/claudeAliens";
import type { Alien, AlienTier } from "@/game/types";
import { marchIntervalMs } from "@/game/waves";

export type AlienFormation = {
  aliens: Alien[];
  originX: number;
  originY: number;
  direction: 1 | -1;
  marchTimer: number;
};

function tierForRow(row: number): AlienTier {
  if (row === 0) return 0;
  if (row <= 2) return 1;
  return 2;
}

export function createAlienFormation(): AlienFormation {
  const aliens: Alien[] = [];
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      aliens.push({ row, col, tier: tierForRow(row), alive: true, frame: 0 });
    }
  }
  return {
    aliens,
    originX: ALIEN_SIDE_MARGIN,
    originY: ALIEN_TOP_MARGIN,
    direction: 1,
    marchTimer: marchIntervalMs(aliens.length, aliens.length),
  };
}

function aliveColumnBounds(formation: AlienFormation): { minCol: number; maxCol: number } | null {
  let minCol = Infinity;
  let maxCol = -Infinity;
  for (const alien of formation.aliens) {
    if (!alien.alive) continue;
    if (alien.col < minCol) minCol = alien.col;
    if (alien.col > maxCol) maxCol = alien.col;
  }
  return minCol === Infinity ? null : { minCol, maxCol };
}

export function updateAlienFormation(formation: AlienFormation, dtMs: number): void {
  const totalCount = formation.aliens.length;
  const aliveCount = formation.aliens.reduce((count, alien) => count + (alien.alive ? 1 : 0), 0);
  if (aliveCount === 0) return;

  formation.marchTimer -= dtMs;
  if (formation.marchTimer > 0) return;
  formation.marchTimer = marchIntervalMs(aliveCount, totalCount);

  const bounds = aliveColumnBounds(formation);
  if (!bounds) return;

  const spriteWidth = ALIEN_WIDTH * ALIEN_PIXEL_SIZE;
  const leftEdge = formation.originX + bounds.minCol * ALIEN_H_SPACING;
  const rightEdge = formation.originX + bounds.maxCol * ALIEN_H_SPACING + spriteWidth;

  const wouldHitRight = formation.direction === 1 && rightEdge + ALIEN_STEP_DISTANCE > CANVAS_WIDTH - ALIEN_SIDE_MARGIN;
  const wouldHitLeft = formation.direction === -1 && leftEdge - ALIEN_STEP_DISTANCE < ALIEN_SIDE_MARGIN;

  if (wouldHitRight || wouldHitLeft) {
    formation.originY += ALIEN_DROP_DISTANCE;
    formation.direction = formation.direction === 1 ? -1 : 1;
  } else {
    formation.originX += formation.direction * ALIEN_STEP_DISTANCE;
  }

  for (const alien of formation.aliens) {
    if (alien.alive) alien.frame = alien.frame === 0 ? 1 : 0;
  }
}

export function drawAlienFormation(ctx: CanvasRenderingContext2D, formation: AlienFormation): void {
  for (const alien of formation.aliens) {
    if (!alien.alive) continue;
    const x = formation.originX + alien.col * ALIEN_H_SPACING;
    const y = formation.originY + alien.row * ALIEN_V_SPACING;
    const sprite = ALIEN_SPRITES[alien.tier][alien.frame];
    drawSprite(ctx, sprite, x, y, ALIEN_PIXEL_SIZE, ["transparent", COLORS.coral]);
  }
}
