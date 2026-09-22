const MAX_MARCH_INTERVAL_MS = 800;
const MIN_MARCH_INTERVAL_MS = 100;

// Interpolates the alien march tempo between a slow start and a fast finish
// as the formation is thinned out — the classic "heartbeat" speed-up.
// A later tier will extend this with a per-wave multiplier once multi-wave
// progression and the audio march-step tie-in land.
export function marchIntervalMs(aliveCount: number, totalCount: number): number {
  const remainingRatio = aliveCount / totalCount;
  return MIN_MARCH_INTERVAL_MS + (MAX_MARCH_INTERVAL_MS - MIN_MARCH_INTERVAL_MS) * remainingRatio;
}
