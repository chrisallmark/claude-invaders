let scanlinePattern: CanvasPattern | null = null;

// A 1x4 repeating tile (2 dark pixels, 2 transparent pixels) built once and
// cached, so the per-frame cost is just a single patterned fillRect.
function getScanlinePattern(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  if (scanlinePattern) return scanlinePattern;

  const tile = document.createElement("canvas");
  tile.width = 1;
  tile.height = 4;
  const tileCtx = tile.getContext("2d");
  if (!tileCtx) return null;

  tileCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
  tileCtx.fillRect(0, 0, 1, 2);

  scanlinePattern = ctx.createPattern(tile, "repeat");
  return scanlinePattern;
}

export function drawCrtOverlay(ctx: CanvasRenderingContext2D): void {
  const pattern = getScanlinePattern(ctx);
  if (!pattern) return;

  // Draw in raw device pixels, independent of the backing-store scale, so
  // the scanline thickness stays a fixed 2 device pixels regardless of it.
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}
