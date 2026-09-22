import { CANVAS_HEIGHT, COLORS, PLAYER_BULLET_PIXEL_SIZE, PLAYER_BULLET_SPEED } from "@/game/constants";
import type { Bullet, Player } from "@/game/types";

const BULLET_WIDTH = 1;
const BULLET_HEIGHT = 4;

export function createBulletPool(size: number): Bullet[] {
  return Array.from({ length: size }, () => ({ x: 0, y: 0, vy: 0, active: false }));
}

// Classic arcade rule: only one player bullet may be on screen at a time.
export function spawnPlayerBullet(pool: Bullet[], player: Player): void {
  if (pool.some((bullet) => bullet.active)) return;
  const slot = pool.find((bullet) => !bullet.active);
  if (!slot) return;

  slot.active = true;
  slot.x = player.x + player.width / 2 - (BULLET_WIDTH * PLAYER_BULLET_PIXEL_SIZE) / 2;
  slot.y = player.y - BULLET_HEIGHT * PLAYER_BULLET_PIXEL_SIZE;
  slot.vy = -PLAYER_BULLET_SPEED;
}

export function updateBullets(pool: Bullet[], dtMs: number): void {
  const dtSec = dtMs / 1000;
  const heightPx = BULLET_HEIGHT * PLAYER_BULLET_PIXEL_SIZE;
  for (const bullet of pool) {
    if (!bullet.active) continue;
    bullet.y += bullet.vy * dtSec;
    if (bullet.y + heightPx < 0 || bullet.y > CANVAS_HEIGHT) {
      bullet.active = false;
    }
  }
}

export function drawBullets(ctx: CanvasRenderingContext2D, pool: Bullet[]): void {
  ctx.fillStyle = COLORS.green;
  for (const bullet of pool) {
    if (!bullet.active) continue;
    ctx.fillRect(
      Math.round(bullet.x),
      Math.round(bullet.y),
      BULLET_WIDTH * PLAYER_BULLET_PIXEL_SIZE,
      BULLET_HEIGHT * PLAYER_BULLET_PIXEL_SIZE,
    );
  }
}
