import { CANVAS_WIDTH, COLORS, UFO_PIXEL_SIZE, UFO_SCORE_TABLE, UFO_SPEED, UFO_Y } from "@/game/constants";
import type { Rect } from "@/game/collision";
import { drawSprite } from "@/game/sprites";
import { UFO_SHIP } from "@/game/sprites/arcade";
import type { Ufo } from "@/game/types";

const UFO_WIDTH = UFO_SHIP[0].length;
const UFO_HEIGHT = UFO_SHIP.length;

export function createUfo(): Ufo {
  return { x: -UFO_WIDTH * UFO_PIXEL_SIZE, y: UFO_Y, active: false, direction: 1 };
}

export function spawnUfo(ufo: Ufo): void {
  ufo.active = true;
  ufo.direction = 1;
  ufo.x = -UFO_WIDTH * UFO_PIXEL_SIZE;
}

export function updateUfo(ufo: Ufo, dtMs: number): void {
  if (!ufo.active) return;
  ufo.x += ufo.direction * UFO_SPEED * (dtMs / 1000);
  const width = UFO_WIDTH * UFO_PIXEL_SIZE;
  if (ufo.x > CANVAS_WIDTH || ufo.x + width < 0) {
    ufo.active = false;
  }
}

export function ufoRect(ufo: Ufo): Rect {
  return { x: ufo.x, y: ufo.y, width: UFO_WIDTH * UFO_PIXEL_SIZE, height: UFO_HEIGHT * UFO_PIXEL_SIZE };
}

// shotCount is the 1-based count of the shot that just hit the UFO (the
// Nth shot fired this wave maps to slot N-1, wrapping every 15 shots).
export function ufoScoreForShotCount(shotCount: number): number {
  const index = (shotCount - 1) % UFO_SCORE_TABLE.length;
  return UFO_SCORE_TABLE[index];
}

export function drawUfo(ctx: CanvasRenderingContext2D, ufo: Ufo): void {
  if (!ufo.active) return;
  drawSprite(ctx, UFO_SHIP, ufo.x, ufo.y, UFO_PIXEL_SIZE, ["transparent", COLORS.red]);
}
