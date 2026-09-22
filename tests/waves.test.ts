import { describe, expect, it } from "vitest";
import { SCORE_BY_TIER, UFO_SCORE_TABLE } from "@/game/constants";
import { ufoScoreForShotCount } from "@/game/entities/ufo";
import { marchIntervalMs } from "@/game/waves";

describe("marchIntervalMs", () => {
  it("is faster with a thinned formation than a full one", () => {
    const full = marchIntervalMs(55, 55, 1);
    const thin = marchIntervalMs(5, 55, 1);
    expect(thin).toBeLessThan(full);
  });

  it("never drops below the floor even at a high wave number", () => {
    const interval = marchIntervalMs(1, 55, 20);
    expect(interval).toBeGreaterThanOrEqual(40);
  });

  it("scales the whole curve down as the wave number increases", () => {
    const wave1 = marchIntervalMs(55, 55, 1);
    const wave2 = marchIntervalMs(55, 55, 2);
    expect(wave2).toBeLessThan(wave1);
  });
});

describe("scoring constants", () => {
  it("matches the canonical arcade point values by tier (squid/crab/octopus)", () => {
    expect(SCORE_BY_TIER).toEqual({ 0: 30, 1: 20, 2: 10 });
  });

  it("matches the classic 15-slot UFO score lookup table", () => {
    expect(UFO_SCORE_TABLE).toEqual([100, 50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100]);
  });
});

describe("ufoScoreForShotCount", () => {
  it("maps the Nth shot to slot N-1, matching the ROM table exactly", () => {
    expect(ufoScoreForShotCount(1)).toBe(100);
    expect(ufoScoreForShotCount(5)).toBe(150);
    expect(ufoScoreForShotCount(9)).toBe(300);
    expect(ufoScoreForShotCount(15)).toBe(100);
  });

  it("wraps back to slot 1 on the 16th shot", () => {
    expect(ufoScoreForShotCount(16)).toBe(ufoScoreForShotCount(1));
  });
});
