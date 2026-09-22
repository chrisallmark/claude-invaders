import { parseBitmap } from "@/game/sprites";
import type { Bitmap } from "@/game/types";

// Authentic-arcade sprites (player, UFO, bullets, bunkers, HUD font) live here.
// Claude-themed alien sprites live in ./claudeAliens.ts, kept separate so the
// "faithful arcade shell / Claude aliens" split stays obvious in the codebase.

export const PLAYER_SHIP: Bitmap = parseBitmap([
  "....#....",
  "...###...",
  "...###...",
  ".#######.",
  "#########",
  "#########",
  "#########",
  "#########",
]);

export const GLYPH_WIDTH = 5;
export const GLYPH_HEIGHT = 7;

const SPACE_ROW = ".....";

// Minimal 5x7 glyph set — only the characters used so far ("CLAUDE INVADERS").
// Extend as new HUD/screen text is introduced in later tiers.
const GLYPH_ROWS: Record<string, readonly string[]> = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", ".#.#.", ".#.#.", "..#.."],
  " ": Array.from({ length: GLYPH_HEIGHT }, () => SPACE_ROW),
};

export const FONT: Record<string, Bitmap> = Object.fromEntries(
  Object.entries(GLYPH_ROWS).map(([ch, rows]) => [ch, parseBitmap(rows)]),
);
