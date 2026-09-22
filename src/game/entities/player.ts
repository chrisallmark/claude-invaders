import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLORS,
  PLAYER_LIVES,
  PLAYER_PIXEL_SIZE,
  PLAYER_SPEED,
  SCREEN_EDGE_MARGIN,
} from "@/game/constants";
import type { Rect } from "@/game/collision";
import { drawSprite } from "@/game/sprites";
import { PLAYER_SHIP } from "@/game/sprites/arcade";
import type { InputState, Player } from "@/game/types";

export const PLAYER_WIDTH = PLAYER_SHIP[0].length * PLAYER_PIXEL_SIZE;
export const PLAYER_HEIGHT = PLAYER_SHIP.length * PLAYER_PIXEL_SIZE;
export const PLAYER_Y = CANVAS_HEIGHT - PLAYER_HEIGHT - SCREEN_EDGE_MARGIN;

export function createPlayer(): Player {
  return {
    x: (CANVAS_WIDTH - PLAYER_WIDTH) / 2,
    y: PLAYER_Y,
    width: PLAYER_WIDTH,
    lives: PLAYER_LIVES,
    alive: true,
    respawnTimer: 0,
  };
}

export function respawnPlayer(player: Player): void {
  player.alive = true;
  player.x = (CANVAS_WIDTH - player.width) / 2;
}

export function updatePlayer(player: Player, input: InputState, dtMs: number): void {
  const distance = (PLAYER_SPEED * dtMs) / 1000;
  if (input.left) player.x -= distance;
  if (input.right) player.x += distance;
  player.x = Math.min(Math.max(player.x, 0), CANVAS_WIDTH - player.width);
}

export function playerRect(player: Player): Rect {
  return { x: player.x, y: player.y, width: player.width, height: PLAYER_HEIGHT };
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  drawSprite(ctx, PLAYER_SHIP, player.x, player.y, PLAYER_PIXEL_SIZE, ["transparent", COLORS.green]);
}
