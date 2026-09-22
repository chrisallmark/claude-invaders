import { aabbOverlap } from "@/game/collision";
import {
  ALIEN_FIRE_INTERVAL_MAX_MS,
  ALIEN_FIRE_INTERVAL_MIN_MS,
  ALIEN_PIXEL_SIZE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLORS,
  RESPAWN_PAUSE_MS,
  SCORE_BY_TIER,
} from "@/game/constants";
import {
  alienRect,
  alienScreenPosition,
  createAlienFormation,
  drawAlienFormation,
  getFiringAliens,
  updateAlienFormation,
  type AlienFormation,
} from "@/game/entities/aliens";
import {
  bulletRect,
  createBulletPool,
  drawBullets,
  spawnAlienBullet,
  spawnPlayerBullet,
  updateBullets,
} from "@/game/entities/bullets";
import { bunkerRect, createBunkers, damageBunkerAt, drawBunkers } from "@/game/entities/bunkers";
import { createPlayer, drawPlayer, playerRect, respawnPlayer, updatePlayer } from "@/game/entities/player";
import { ALIEN_HEIGHT, ALIEN_WIDTH } from "@/game/sprites/claudeAliens";
import { drawGameOverOverlay, drawHud } from "@/game/hud";
import type { Bullet, Bunker, InputState, Player } from "@/game/types";

const PLAYER_BULLET_POOL_SIZE = 1;
const ALIEN_BULLET_POOL_SIZE = 3;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export class GameEngine {
  private readonly input: InputState;
  private readonly player: Player;
  private readonly playerBullets: Bullet[];
  private readonly alienBullets: Bullet[];
  private readonly aliens: AlienFormation;
  private readonly bunkers: Bunker[];
  private score = 0;
  private alienFireTimer = randomBetween(ALIEN_FIRE_INTERVAL_MIN_MS, ALIEN_FIRE_INTERVAL_MAX_MS);

  constructor(input: InputState) {
    this.input = input;
    this.player = createPlayer();
    this.playerBullets = createBulletPool(PLAYER_BULLET_POOL_SIZE);
    this.alienBullets = createBulletPool(ALIEN_BULLET_POOL_SIZE);
    this.aliens = createAlienFormation();
    this.bunkers = createBunkers();
  }

  update(dtMs: number): void {
    if (this.player.lives <= 0) return;

    if (!this.player.alive) {
      this.player.respawnTimer -= dtMs;
      if (this.player.respawnTimer <= 0) {
        respawnPlayer(this.player);
      }
    } else {
      updatePlayer(this.player, this.input, dtMs);
      if (this.input.fire) {
        spawnPlayerBullet(this.playerBullets, this.player);
      }
    }

    updateBullets(this.playerBullets, dtMs);
    updateBullets(this.alienBullets, dtMs);
    updateAlienFormation(this.aliens, dtMs);

    this.alienFireTimer -= dtMs;
    if (this.alienFireTimer <= 0) {
      this.tryFireAlienBullet();
      this.alienFireTimer = randomBetween(ALIEN_FIRE_INTERVAL_MIN_MS, ALIEN_FIRE_INTERVAL_MAX_MS);
    }

    this.handleBunkerCollisions(this.playerBullets);
    this.handleBunkerCollisions(this.alienBullets);
    this.handlePlayerBulletCollisions();
    this.handleAlienBulletCollisions();
  }

  private handleBunkerCollisions(bullets: Bullet[]): void {
    for (const bullet of bullets) {
      if (!bullet.active) continue;
      const bRect = bulletRect(bullet);
      for (const bunker of this.bunkers) {
        if (!aabbOverlap(bRect, bunkerRect(bunker))) continue;
        const impactX = bullet.x + bRect.width / 2;
        const impactY = bullet.y + bRect.height / 2;
        if (damageBunkerAt(bunker, impactX, impactY)) {
          bullet.active = false;
          break;
        }
      }
    }
  }

  private tryFireAlienBullet(): void {
    const candidates = getFiringAliens(this.aliens);
    if (candidates.length === 0) return;
    const alien = candidates[Math.floor(Math.random() * candidates.length)];
    const { x, y } = alienScreenPosition(this.aliens, alien);
    spawnAlienBullet(this.alienBullets, x + (ALIEN_WIDTH * ALIEN_PIXEL_SIZE) / 2, y + ALIEN_HEIGHT * ALIEN_PIXEL_SIZE);
  }

  private handlePlayerBulletCollisions(): void {
    for (const bullet of this.playerBullets) {
      if (!bullet.active) continue;
      const bRect = bulletRect(bullet);
      for (const alien of this.aliens.aliens) {
        if (!alien.alive) continue;
        if (aabbOverlap(bRect, alienRect(this.aliens, alien))) {
          alien.alive = false;
          bullet.active = false;
          this.score += SCORE_BY_TIER[alien.tier];
          break;
        }
      }
    }
  }

  private handleAlienBulletCollisions(): void {
    if (!this.player.alive) return;
    const pRect = playerRect(this.player);
    for (const bullet of this.alienBullets) {
      if (!bullet.active) continue;
      if (aabbOverlap(bulletRect(bullet), pRect)) {
        bullet.active = false;
        this.player.lives -= 1;
        this.player.alive = false;
        this.player.respawnTimer = RESPAWN_PAUSE_MS;
        break;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawBunkers(ctx, this.bunkers);

    if (this.player.alive) {
      drawPlayer(ctx, this.player);
    }
    drawBullets(ctx, this.playerBullets, COLORS.green);
    drawBullets(ctx, this.alienBullets, COLORS.white);
    drawAlienFormation(ctx, this.aliens);
    drawHud(ctx, this.score, this.player.lives);

    if (this.player.lives <= 0) {
      drawGameOverOverlay(ctx);
    }
  }
}
