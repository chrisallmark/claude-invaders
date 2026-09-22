import { COLORS } from "@/game/constants";
import { drawSprite, drawText, parseBitmap, textWidth } from "@/game/sprites";
import { FONT, GLYPH_HEIGHT, GLYPH_WIDTH } from "@/game/sprites/arcade";
import type { Bitmap, Explosion, ExplosionKind } from "@/game/types";

const EXPLOSION_TTL_MS = 400;
const EXPLOSION_PIXEL_SIZE = 1;
const LABEL_PIXEL_SIZE = 1;

// The classic arcade "debris" explosion, shared by the UFO and aliens: 4
// diagonal staircases of square fragments radiating from each corner, plus
// 2 flat side bars, with an empty center (also doubles as the UFO
// score-label backdrop).
const DEBRIS_BURST = parseBitmap([
  ".#.....#.",
  "..#...#..",
  "...#.#...",
  "##.....##",
  "...#.#...",
  "..#...#..",
  ".#.....#.",
]);

// The player ship's death explosion: an irregular upward "spray", scattered
// fragments thinning out above a dense mound at the base — distinct from
// the UFO's symmetric debris pattern.
const PLAYER_BURST = parseBitmap([
  "..#.....#..",
  ".#...#...#.",
  "#...#...#..",
  "..##..##.#.",
  ".####.####.",
  ".#########.",
  "###########",
]);
const PLAYER_BURST_FLIPPED: Bitmap = PLAYER_BURST.map((row) => [...row].reverse());
const PLAYER_FLIP_INTERVAL_MS = 100;

const BURST_BY_KIND: Record<ExplosionKind, Bitmap> = {
  player: PLAYER_BURST,
  ufo: DEBRIS_BURST,
  alien: DEBRIS_BURST,
};

const COLOR_BY_KIND: Record<ExplosionKind, string> = {
  player: COLORS.green,
  ufo: COLORS.red,
  alien: COLORS.coral,
};

function burstDimensions(kind: ExplosionKind): { width: number; height: number } {
  const bitmap = BURST_BY_KIND[kind];
  return { width: bitmap[0].length, height: bitmap.length };
}

export function spawnExplosion(
  list: Explosion[],
  centerX: number,
  centerY: number,
  kind: ExplosionKind,
  label?: string,
): void {
  const { width, height } = burstDimensions(kind);
  list.push({
    x: centerX - (width * EXPLOSION_PIXEL_SIZE) / 2,
    y: centerY - (height * EXPLOSION_PIXEL_SIZE) / 2,
    kind,
    age: 0,
    ttl: EXPLOSION_TTL_MS,
    label,
  });
}

export function updateExplosions(list: Explosion[], dtMs: number): void {
  for (let i = list.length - 1; i >= 0; i--) {
    list[i].age += dtMs;
    if (list[i].age >= list[i].ttl) list.splice(i, 1);
  }
}

export function drawExplosions(ctx: CanvasRenderingContext2D, list: Explosion[]): void {
  for (const explosion of list) {
    let bitmap = BURST_BY_KIND[explosion.kind];
    if (explosion.kind === "player") {
      const flipped = Math.floor(explosion.age / PLAYER_FLIP_INTERVAL_MS) % 2 === 1;
      bitmap = flipped ? PLAYER_BURST_FLIPPED : PLAYER_BURST;
    }
    const color = COLOR_BY_KIND[explosion.kind];
    drawSprite(ctx, bitmap, explosion.x, explosion.y, EXPLOSION_PIXEL_SIZE, ["transparent", color]);

    if (explosion.label) {
      const { width, height } = burstDimensions(explosion.kind);
      const labelWidth = textWidth(explosion.label, GLYPH_WIDTH, LABEL_PIXEL_SIZE);
      const labelHeight = GLYPH_HEIGHT * LABEL_PIXEL_SIZE;
      const labelX = explosion.x + (width * EXPLOSION_PIXEL_SIZE) / 2 - labelWidth / 2;
      const labelY = explosion.y + (height * EXPLOSION_PIXEL_SIZE) / 2 - labelHeight / 2;
      drawText(ctx, explosion.label, labelX, labelY, LABEL_PIXEL_SIZE, COLORS.white, FONT, GLYPH_WIDTH);
    }
  }
}
