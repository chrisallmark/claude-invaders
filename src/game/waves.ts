const MAX_MARCH_INTERVAL_MS = 800;
const MIN_MARCH_INTERVAL_MS = 50;
const MARCH_INTERVAL_FLOOR_MS = 40;
const WAVE_SPEED_MULTIPLIER = 0.85; // each new wave marches ~15% faster overall

// Interpolates the alien march tempo between a slow start and a fast finish
// as the formation is thinned out (the classic "heartbeat" speed-up), then
// scales the whole curve down further for each wave already cleared.
//
// The ratio is eased quadratically rather than linearly interpolated: a
// linear ramp barely speeds up until the formation is almost gone, whereas
// the real arcade's tempo curve is noticeably faster by the halfway point
// and frantic near the end.
export function marchIntervalMs(aliveCount: number, totalCount: number, waveNumber: number): number {
  const remainingRatio = aliveCount / totalCount;
  const eased = remainingRatio * remainingRatio;
  const base = MIN_MARCH_INTERVAL_MS + (MAX_MARCH_INTERVAL_MS - MIN_MARCH_INTERVAL_MS) * eased;
  const waveScaled = base * Math.pow(WAVE_SPEED_MULTIPLIER, Math.max(0, waveNumber - 1));
  return Math.max(MARCH_INTERVAL_FLOOR_MS, waveScaled);
}
