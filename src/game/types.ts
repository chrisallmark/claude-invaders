export type Bitmap = number[][];
export type Palette = string[];

export type InputState = {
  left: boolean;
  right: boolean;
  fire: boolean;
};

export type Player = {
  x: number;
  y: number;
  width: number;
};

export type Bullet = {
  x: number;
  y: number;
  vy: number;
  active: boolean;
};

// 0 = top row (30 pts), 1 = middle rows (20 pts), 2 = bottom rows (10 pts).
export type AlienTier = 0 | 1 | 2;

export type Alien = {
  row: number;
  col: number;
  tier: AlienTier;
  alive: boolean;
  frame: 0 | 1;
};
