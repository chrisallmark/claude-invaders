import { CANVAS_HEIGHT, CANVAS_WIDTH, COLORS } from "@/game/constants";
import { createBulletPool, drawBullets, spawnPlayerBullet, updateBullets } from "@/game/entities/bullets";
import { createPlayer, drawPlayer, updatePlayer } from "@/game/entities/player";
import type { Bullet, InputState, Player } from "@/game/types";

const PLAYER_BULLET_POOL_SIZE = 1;

export class GameEngine {
  private readonly input: InputState;
  private readonly player: Player;
  private readonly playerBullets: Bullet[];

  constructor(input: InputState) {
    this.input = input;
    this.player = createPlayer();
    this.playerBullets = createBulletPool(PLAYER_BULLET_POOL_SIZE);
  }

  update(dtMs: number): void {
    updatePlayer(this.player, this.input, dtMs);
    if (this.input.fire) {
      spawnPlayerBullet(this.playerBullets, this.player);
    }
    updateBullets(this.playerBullets, dtMs);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawPlayer(ctx, this.player);
    drawBullets(ctx, this.playerBullets);
  }
}
