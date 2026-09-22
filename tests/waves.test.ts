import { describe, expect, it } from "vitest";
import { SCORE_BY_TIER, UFO_BONUS_VALUES } from "@/game/constants";
import { marchIntervalMs } from "@/game/waves";

describe("marchIntervalMs", () => {
  it("is faster with a thinned formation than a full one", () => {
    const full = marchIntervalMs(55, 55, 1);
    const thin = marchIntervalMs(5, 55, 1);
    expect(thin).toBeLessThan(full);
  });

  it("never drops below the floor even at a high wave number", () => {
    const interval = marchIntervalMs(1, 55, 20);
    expect(interval).toBeGreaterThanOrEqual(60);
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

  it("matches the classic UFO bonus set", () => {
    expect(UFO_BONUS_VALUES).toEqual([50, 100, 150, 300]);
  });
});
