import type { AlienTier } from "@/game/types";

export const CANVAS_WIDTH = 224;
export const CANVAS_HEIGHT = 256;
export const SCREEN_EDGE_MARGIN = 8; // shared top (HUD) / bottom (player) margin

export const COLORS = {
  black: "#000000",
  green: "#33ff33",
  white: "#ffffff",
  coral: "#d97757",
  red: "#ff5555",
} as const;

export const FIXED_STEP_MS = 1000 / 60;

export const PLAYER_SPEED = 100; // logical px/sec
export const PLAYER_PIXEL_SIZE = 1;

export const PLAYER_LIVES = 3;
export const RESPAWN_PAUSE_MS = 1500;

export const BULLET_PIXEL_SIZE = 1;
export const PLAYER_BULLET_SPEED = 200; // logical px/sec, upward (negative vy)
export const ALIEN_BULLET_SPEED = 80; // logical px/sec, downward
export const ALIEN_FIRE_INTERVAL_MIN_MS = 500;
export const ALIEN_FIRE_INTERVAL_MAX_MS = 1500;

export const ALIEN_ROWS = 5;
export const ALIEN_COLS = 11;
export const ALIEN_PIXEL_SIZE = 1;
export const ALIEN_H_SPACING = 14; // logical px between alien origins, horizontally
export const ALIEN_V_SPACING = 16; // logical px between alien origins, vertically
export const ALIEN_STEP_DISTANCE = 4; // logical px moved per march step
export const ALIEN_DROP_DISTANCE = 8; // logical px dropped when the formation hits an edge
export const ALIEN_TOP_MARGIN = 64; // leaves room for the UFO row above the formation
export const ALIEN_SIDE_MARGIN = 8;

export const UFO_PIXEL_SIZE = 1;
export const UFO_SPEED = 40; // logical px/sec
export const UFO_Y = 44;

// Original arcade behavior: a deterministic 25.6s timer, not random, which
// pauses (rather than resets) while too few aliens remain or the formation
// has gotten dangerously close to the player.
export const UFO_SPAWN_INTERVAL_MS = 25600;
export const UFO_MIN_ALIVE_ALIENS = 8;

// The original arcade ROM's mystery-ship bonus isn't random — it's a fixed
// lookup table indexed by a per-wave running count of every shot the player
// fires, wrapping every 15 shots (a 16th value, 50, exists in the ROM but is
// unreachable since the loop wraps at 15).
export const UFO_SCORE_TABLE = [100, 50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100] as const;

export const SCORE_BY_TIER: Record<AlienTier, number> = {
  0: 30,
  1: 20,
  2: 10,
};

export const EXTEND_PLAY_SCORE = 1500;

export const BUNKER_COUNT = 4;
export const BUNKER_PIXEL_SIZE = 2;
export const BUNKER_PLAYER_GAP = 16; // logical px between the bunkers' bottom edge and the player's top edge
