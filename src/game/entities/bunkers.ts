import { BUNKER_COUNT, BUNKER_PIXEL_SIZE, BUNKER_PLAYER_GAP, CANVAS_WIDTH, COLORS } from "@/game/constants";
import type { Rect } from "@/game/collision";
import { PLAYER_Y } from "@/game/entities/player";
import { drawSprite } from "@/game/sprites";
import { BUNKER_TEMPLATE } from "@/game/sprites/arcade";
import type { Bunker, BunkerCell } from "@/game/types";

const BUNKER_WIDTH = BUNKER_TEMPLATE[0].length;
const BUNKER_HEIGHT = BUNKER_TEMPLATE.length;
const BUNKER_Y = PLAYER_Y - BUNKER_HEIGHT * BUNKER_PIXEL_SIZE - BUNKER_PLAYER_GAP;

function cloneTemplate(): BunkerCell[][] {
  return BUNKER_TEMPLATE.map((row) => row.map((cell) => cell as BunkerCell));
}

export function createBunkers(): Bunker[] {
  const slotWidth = CANVAS_WIDTH / BUNKER_COUNT;
  const bunkerPixelWidth = BUNKER_WIDTH * BUNKER_PIXEL_SIZE;
  return Array.from({ length: BUNKER_COUNT }, (_, index) => ({
    originX: index * slotWidth + (slotWidth - bunkerPixelWidth) / 2,
    originY: BUNKER_Y,
    pixels: cloneTemplate(),
  }));
}

export function bunkerRect(bunker: Bunker): Rect {
  return {
    x: bunker.originX,
    y: bunker.originY,
    width: BUNKER_WIDTH * BUNKER_PIXEL_SIZE,
    height: BUNKER_HEIGHT * BUNKER_PIXEL_SIZE,
  };
}

// If (x, y) lands on a still-solid bunker cell, erodes a small neighborhood
// around it and returns true. Already-eroded cells report no hit, so
// bullets tunnel through holes previously carved into the bunker.
export function damageBunkerAt(bunker: Bunker, x: number, y: number): boolean {
  const localCol = Math.floor((x - bunker.originX) / BUNKER_PIXEL_SIZE);
  const localRow = Math.floor((y - bunker.originY) / BUNKER_PIXEL_SIZE);
  if (localRow < 0 || localRow >= BUNKER_HEIGHT || localCol < 0 || localCol >= BUNKER_WIDTH) return false;
  if (bunker.pixels[localRow][localCol] === 0) return false;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = localRow + dr;
      const c = localCol + dc;
      if (r < 0 || r >= BUNKER_HEIGHT || c < 0 || c >= BUNKER_WIDTH) continue;
      bunker.pixels[r][c] = 0;
    }
  }
  return true;
}

// Clears every still-solid bunker cell that falls under `rect` (a moving
// alien's bounding box, typically), so the shield erodes layer by layer as
// the alien formation marches down through it. Returns true if any cell
// was actually cleared.
export function eraseBunkerOverlap(bunker: Bunker, rect: Rect): boolean {
  const localLeft = Math.max(0, Math.floor((rect.x - bunker.originX) / BUNKER_PIXEL_SIZE));
  const localRight = Math.min(BUNKER_WIDTH - 1, Math.ceil((rect.x + rect.width - bunker.originX) / BUNKER_PIXEL_SIZE) - 1);
  const localTop = Math.max(0, Math.floor((rect.y - bunker.originY) / BUNKER_PIXEL_SIZE));
  const localBottom = Math.min(BUNKER_HEIGHT - 1, Math.ceil((rect.y + rect.height - bunker.originY) / BUNKER_PIXEL_SIZE) - 1);

  let erased = false;
  for (let r = localTop; r <= localBottom; r++) {
    for (let c = localLeft; c <= localRight; c++) {
      if (bunker.pixels[r][c] !== 0) {
        bunker.pixels[r][c] = 0;
        erased = true;
      }
    }
  }
  return erased;
}

export function drawBunkers(ctx: CanvasRenderingContext2D, bunkers: Bunker[]): void {
  for (const bunker of bunkers) {
    drawSprite(ctx, bunker.pixels, bunker.originX, bunker.originY, BUNKER_PIXEL_SIZE, ["transparent", COLORS.green]);
  }
}
