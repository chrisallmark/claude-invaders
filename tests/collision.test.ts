import { describe, expect, it } from "vitest";
import { aabbOverlap } from "@/game/collision";
import { BUNKER_PIXEL_SIZE } from "@/game/constants";
import { damageBunkerAt } from "@/game/entities/bunkers";
import type { Bunker } from "@/game/types";

describe("aabbOverlap", () => {
  it("detects overlapping rectangles", () => {
    expect(aabbOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
  });

  it("detects non-overlapping rectangles", () => {
    expect(aabbOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 20, width: 10, height: 10 })).toBe(false);
  });

  it("treats edge-touching rectangles as not overlapping", () => {
    expect(aabbOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 })).toBe(false);
  });
});

function makeSolidBunker(): Bunker {
  return {
    originX: 0,
    originY: 0,
    pixels: Array.from({ length: 5 }, () => [1, 1, 1, 1, 1]),
  };
}

describe("damageBunkerAt", () => {
  it("erodes a 3x3 neighborhood around a solid hit and reports the hit", () => {
    const bunker = makeSolidBunker();
    const hit = damageBunkerAt(bunker, 2 * BUNKER_PIXEL_SIZE, 2 * BUNKER_PIXEL_SIZE);

    expect(hit).toBe(true);
    expect(bunker.pixels[1][1]).toBe(0);
    expect(bunker.pixels[2][2]).toBe(0);
    expect(bunker.pixels[3][3]).toBe(0);
    expect(bunker.pixels[0][0]).toBe(1); // untouched, outside the erosion radius
  });

  it("lets a bullet tunnel through an already-eroded cell", () => {
    const bunker = makeSolidBunker();
    bunker.pixels[2][2] = 0;

    const hit = damageBunkerAt(bunker, 2 * BUNKER_PIXEL_SIZE, 2 * BUNKER_PIXEL_SIZE);

    expect(hit).toBe(false);
  });

  it("returns false for a point outside the bunker's bounds", () => {
    const bunker = makeSolidBunker();
    expect(damageBunkerAt(bunker, -100, -100)).toBe(false);
  });
});
