import type { Bitmap, Palette } from "@/game/types";

export function parseBitmap(rows: readonly string[], onChar = "#"): Bitmap {
  return rows.map((row) => row.split("").map((ch) => (ch === onChar ? 1 : 0)));
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  bitmap: Bitmap,
  x: number,
  y: number,
  pixelSize: number,
  palette: Palette,
): void {
  for (let row = 0; row < bitmap.length; row++) {
    const cells = bitmap[row];
    for (let col = 0; col < cells.length; col++) {
      const value = cells[col];
      if (value === 0) continue;
      ctx.fillStyle = palette[value] ?? palette[1];
      ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
    }
  }
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  pixelSize: number,
  color: string,
  font: Record<string, Bitmap>,
  glyphWidth: number,
): void {
  let cursorX = x;
  for (const ch of text.toUpperCase()) {
    const glyph = font[ch] ?? font[" "];
    if (glyph) {
      drawSprite(ctx, glyph, cursorX, y, pixelSize, ["transparent", color]);
    }
    cursorX += (glyphWidth + 1) * pixelSize;
  }
}

export function textWidth(text: string, glyphWidth: number, pixelSize: number): number {
  return text.length * (glyphWidth + 1) * pixelSize - pixelSize;
}
