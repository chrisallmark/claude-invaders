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
