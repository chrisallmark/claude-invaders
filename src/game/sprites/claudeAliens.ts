import { parseBitmap } from "@/game/sprites";
import type { AlienTier, Bitmap } from "@/game/types";

// Claude-themed alien sprites — the one deliberate departure from the
// authentic-arcade look (see ./arcade.ts). Each tier keeps the same 8x8
// bounding box and 2-frame leg-swap animation convention as the classic
// squid/crab/octopus aliens it replaces.

const TIER0_FRAME_A = parseBitmap([
  ".....#.....",
  "....###....",
  "...#####...",
  "..#.##.##..",
  ".#########.",
  ".#..###..#.",
  "...#...#...",
  ".##.....##.",
]);

const TIER0_FRAME_B = parseBitmap([
  ".....#.....",
  ".#..###..#.",
  ".#.#####.#.",
  ".###.##.##.",
  "..#######..",
  "...#####...",
  "..#.....#..",
  "...##.##...",
]);

const TIER1_FRAME_A = parseBitmap([
  "..###..###.",
  "..#.####.#.",
  "..###..###.",
  "...#..##...",
  "..#######..",
  ".#.#####.#.",
  "..###.###..",
  ".###...###.",
]);

const TIER1_FRAME_B = parseBitmap([
  ".###..###..",
  ".#.####.#..",
  ".###..###..",
  "...##..#...",
  "..#######..",
  ".#.#####.#.",
  ".###...###.",
  "..###.###..",
]);

const TIER2_FRAME_A = parseBitmap([
  "..#######..",
  "..#..#..#..",
  "####.##.###",
  "###########",
  "..#######..",
  "..#.#.#.#..",
  "..#.#.#.#..",
  "..#.#.#.#..",
]);

const TIER2_FRAME_B = parseBitmap([
  "..#######..",
  "..#..#..#..",
  "###.##.####",
  "###########",
  "..#######..",
  "..#.#.#.#..",
  ".#..#.#..#.",
  ".#.#...#.#.",
]);

export const ALIEN_SPRITES: Record<AlienTier, [Bitmap, Bitmap]> = {
  0: [TIER0_FRAME_A, TIER0_FRAME_B],
  1: [TIER1_FRAME_A, TIER1_FRAME_B],
  2: [TIER2_FRAME_A, TIER2_FRAME_B],
};

export const ALIEN_WIDTH = TIER0_FRAME_A[0].length;
export const ALIEN_HEIGHT = TIER0_FRAME_A.length;
