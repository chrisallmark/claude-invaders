import { AudioManager } from "@/game/audio";
import { aabbOverlap } from "@/game/collision";
import {
  ALIEN_FIRE_INTERVAL_MAX_MS,
  ALIEN_FIRE_INTERVAL_MIN_MS,
  ALIEN_PIXEL_SIZE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLORS,
  EXTEND_PLAY_SCORE,
  RESPAWN_PAUSE_MS,
  SCORE_BY_TIER,
  UFO_SPAWN_INTERVAL_MAX_MS,
  UFO_SPAWN_INTERVAL_MIN_MS,
} from "@/game/constants";
import {
  alienRect,
  alienScreenPosition,
  createAlienFormation,
  drawAlienFormation,
  getFiringAliens,
  hasFormationReachedLimit,
  isWaveCleared,
  startNextWave,
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
import { bunkerRect, createBunkers, damageBunkerAt, drawBunkers, eraseBunkerOverlap } from "@/game/entities/bunkers";
import { drawExplosions, spawnExplosion, updateExplosions } from "@/game/entities/explosions";
import { createPlayer, drawPlayer, PLAYER_HEIGHT, playerRect, PLAYER_Y, respawnPlayer, updatePlayer } from "@/game/entities/player";
import { createUfo, drawUfo, spawnUfo, ufoRect, ufoScoreForShotCount, updateUfo } from "@/game/entities/ufo";
import { ALIEN_HEIGHT, ALIEN_WIDTH } from "@/game/sprites/claudeAliens";
import { drawCrtOverlay } from "@/game/crt";
import { drawAttractScreen, drawGameOverOverlay, drawHud } from "@/game/hud";
import { loadHighScore, saveHighScoreIfBeaten } from "@/game/storage";
import type { Bullet, Bunker, Explosion, InputState, Player, Ufo } from "@/game/types";

const PLAYER_BULLET_POOL_SIZE = 1;
const ALIEN_BULLET_POOL_SIZE = 3;

// Classic loss condition: the formation reaches the player's row (not the
// bunkers — aliens march straight through/over the shields, same as the
// original arcade).
const LOSS_LIMIT_Y = PLAYER_Y;

type EngineState = "attract" | "playing" | "gameover";

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export class GameEngine {
  private readonly input: InputState;
  private readonly audio: AudioManager;
  private state: EngineState = "attract";
  private player!: Player;
  private playerBullets!: Bullet[];
  private alienBullets!: Bullet[];
  private aliens!: AlienFormation;
  private bunkers!: Bunker[];
  private ufo!: Ufo;
  private explosions!: Explosion[];
  private score = 0;
  private highScore = loadHighScore();
  private extendPlayAwarded = false;
  private alienFireTimer = 0;
  private ufoSpawnTimer = 0;
  private shotsFired = 0;

  constructor(input: InputState, audio: AudioManager) {
    this.input = input;
    this.audio = audio;
    this.resetEntities();
  }

  private resetEntities(): void {
    this.player = createPlayer();
    this.playerBullets = createBulletPool(PLAYER_BULLET_POOL_SIZE);
    this.alienBullets = createBulletPool(ALIEN_BULLET_POOL_SIZE);
    this.aliens = createAlienFormation();
    this.bunkers = createBunkers();
    this.ufo = createUfo();
    this.explosions = [];
    this.score = 0;
    this.extendPlayAwarded = false;
    this.alienFireTimer = randomBetween(ALIEN_FIRE_INTERVAL_MIN_MS, ALIEN_FIRE_INTERVAL_MAX_MS);
    this.ufoSpawnTimer = randomBetween(UFO_SPAWN_INTERVAL_MIN_MS, UFO_SPAWN_INTERVAL_MAX_MS);
    this.shotsFired = 0;
    this.audio.stopUfoLoop();
  }

  update(dtMs: number): void {
    if (this.state === "attract") {
      if (this.input.fire) this.state = "playing";
      return;
    }

    if (this.state === "gameover") {
      if (this.input.fire) {
        this.resetEntities();
        this.state = "attract";
      }
      return;
    }

    if (!this.player.alive) {
      this.player.respawnTimer -= dtMs;
      if (this.player.respawnTimer <= 0) {
        respawnPlayer(this.player);
      }
    } else {
      updatePlayer(this.player, this.input, dtMs);
      if (this.input.fire && spawnPlayerBullet(this.playerBullets, this.player)) {
        this.shotsFired += 1;
        this.audio.playOneShot("shoot");
      }
    }

    updateBullets(this.playerBullets, dtMs);
    updateBullets(this.alienBullets, dtMs);
    updateExplosions(this.explosions, dtMs);

    // Matches the original arcade: the formation briefly holds still while
    // a kill explosion plays, instead of marching out from under it.
    const hasActiveAlienExplosion = this.explosions.some((explosion) => explosion.kind === "alien");
    if (!hasActiveAlienExplosion && updateAlienFormation(this.aliens, dtMs)) {
      this.audio.stepMarch();
    }

    const wasUfoActive = this.ufo.active;
    updateUfo(this.ufo, dtMs);
    if (wasUfoActive && !this.ufo.active) {
      this.audio.stopUfoLoop();
    }

    this.alienFireTimer -= dtMs;
    if (this.alienFireTimer <= 0) {
      this.tryFireAlienBullet();
      this.alienFireTimer = randomBetween(ALIEN_FIRE_INTERVAL_MIN_MS, ALIEN_FIRE_INTERVAL_MAX_MS);
    }

    if (!this.ufo.active) {
      this.ufoSpawnTimer -= dtMs;
      if (this.ufoSpawnTimer <= 0) {
        spawnUfo(this.ufo);
        this.audio.startUfoLoop();
        this.ufoSpawnTimer = randomBetween(UFO_SPAWN_INTERVAL_MIN_MS, UFO_SPAWN_INTERVAL_MAX_MS);
      }
    }

    this.handleBunkerCollisions(this.playerBullets);
    this.handleBunkerCollisions(this.alienBullets);
    this.handleAlienBunkerOverlap();
    this.handlePlayerBulletCollisions();
    this.handleAlienBulletCollisions();
    this.handleUfoCollisions();
    this.checkExtendPlay();

    if (this.player.lives <= 0 || hasFormationReachedLimit(this.aliens, LOSS_LIMIT_Y)) {
      this.state = "gameover";
      this.audio.stopUfoLoop();
      if (saveHighScoreIfBeaten(this.score)) {
        this.highScore = this.score;
      }
      return;
    }

    if (isWaveCleared(this.aliens)) {
      startNextWave(this.aliens);
      this.shotsFired = 0;
      this.bunkers = createBunkers();
    }
  }

  private checkExtendPlay(): void {
    if (this.extendPlayAwarded || this.score < EXTEND_PLAY_SCORE) return;
    this.extendPlayAwarded = true;
    this.player.lives += 1;
    this.audio.playOneShot("extendPlay");
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

  private handleAlienBunkerOverlap(): void {
    for (const alien of this.aliens.aliens) {
      if (!alien.alive) continue;
      const aRect = alienRect(this.aliens, alien);
      for (const bunker of this.bunkers) {
        if (!aabbOverlap(aRect, bunkerRect(bunker))) continue;
        eraseBunkerOverlap(bunker, aRect);
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
        const aRect = alienRect(this.aliens, alien);
        if (aabbOverlap(bRect, aRect)) {
          alien.alive = false;
          bullet.active = false;
          this.score += SCORE_BY_TIER[alien.tier];
          spawnExplosion(this.explosions, aRect.x + aRect.width / 2, aRect.y + aRect.height / 2, "alien");
          this.audio.playOneShot("invaderKilled");
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
        spawnExplosion(this.explosions, this.player.x + this.player.width / 2, this.player.y + PLAYER_HEIGHT / 2, "player");
        this.audio.playOneShot("explosion");
        break;
      }
    }
  }

  private handleUfoCollisions(): void {
    if (!this.ufo.active) return;
    const uRect = ufoRect(this.ufo);
    for (const bullet of this.playerBullets) {
      if (!bullet.active) continue;
      if (aabbOverlap(bulletRect(bullet), uRect)) {
        bullet.active = false;
        this.ufo.active = false;
        this.audio.stopUfoLoop();
        this.audio.playOneShot("extendPlay");
        const bonus = ufoScoreForShotCount(this.shotsFired);
        this.score += bonus;
        spawnExplosion(this.explosions, uRect.x + uRect.width / 2, uRect.y + uRect.height / 2, "ufo", String(bonus));
        break;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (this.state === "attract") {
      drawAttractScreen(ctx);
      drawCrtOverlay(ctx);
      return;
    }

    drawUfo(ctx, this.ufo);
    drawBunkers(ctx, this.bunkers);

    if (this.player.alive) {
      drawPlayer(ctx, this.player);
    }
    drawBullets(ctx, this.playerBullets, COLORS.green);
    drawBullets(ctx, this.alienBullets, COLORS.white);
    drawAlienFormation(ctx, this.aliens);
    drawExplosions(ctx, this.explosions);
    drawHud(ctx, this.score, this.player.lives, this.highScore);

    if (this.state === "gameover") {
      drawGameOverOverlay(ctx);
    }

    drawCrtOverlay(ctx);
  }
}
