export const CANVAS_WIDTH = 224;
export const CANVAS_HEIGHT = 256;

export const COLORS = {
  black: "#000000",
  green: "#33ff33",
  white: "#ffffff",
  coral: "#d97757",
} as const;

export const FIXED_STEP_MS = 1000 / 60;

export const PLAYER_SPEED = 100; // logical px/sec
export const PLAYER_PIXEL_SIZE = 3;

export const PLAYER_BULLET_SPEED = 200; // logical px/sec, upward (negative vy)
export const PLAYER_BULLET_PIXEL_SIZE = 2;

export const ALIEN_ROWS = 5;
export const ALIEN_COLS = 11;
export const ALIEN_PIXEL_SIZE = 2;
export const ALIEN_H_SPACING = 18; // logical px between alien origins, horizontally
export const ALIEN_V_SPACING = 18; // logical px between alien origins, vertically
export const ALIEN_STEP_DISTANCE = 4; // logical px moved per march step
export const ALIEN_DROP_DISTANCE = 8; // logical px dropped when the formation hits an edge
export const ALIEN_TOP_MARGIN = 30;
export const ALIEN_SIDE_MARGIN = 8;
