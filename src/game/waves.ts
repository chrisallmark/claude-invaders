const MAX_MARCH_INTERVAL_MS = 800;
const MIN_MARCH_INTERVAL_MS = 100;
const MARCH_INTERVAL_FLOOR_MS = 60;
const WAVE_SPEED_MULTIPLIER = 0.85; // each new wave marches ~15% faster overall

// Interpolates the alien march tempo between a slow start and a fast finish
// as the formation is thinned out (the classic "heartbeat" speed-up), then
// scales the whole curve down further for each wave already cleared.
export function marchIntervalMs(aliveCount: number, totalCount: number, waveNumber: number): number {
  const remainingRatio = aliveCount / totalCount;
  const base = MIN_MARCH_INTERVAL_MS + (MAX_MARCH_INTERVAL_MS - MIN_MARCH_INTERVAL_MS) * remainingRatio;
  const waveScaled = base * Math.pow(WAVE_SPEED_MULTIPLIER, Math.max(0, waveNumber - 1));
  return Math.max(MARCH_INTERVAL_FLOOR_MS, waveScaled);
}
