import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/game/constants";

let scanlinePattern: CanvasPattern | null = null;

// A 1x2 repeating tile (one dark pixel, one transparent pixel) built once
// and cached, so the per-frame cost is just a single patterned fillRect.
function getScanlinePattern(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  if (scanlinePattern) return scanlinePattern;

  const tile = document.createElement("canvas");
  tile.width = 1;
  tile.height = 2;
  const tileCtx = tile.getContext("2d");
  if (!tileCtx) return null;

  tileCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
  tileCtx.fillRect(0, 0, 1, 1);

  scanlinePattern = ctx.createPattern(tile, "repeat");
  return scanlinePattern;
}

export function drawCrtOverlay(ctx: CanvasRenderingContext2D): void {
  const pattern = getScanlinePattern(ctx);
  if (!pattern) return;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
