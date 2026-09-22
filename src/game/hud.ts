import { CANVAS_HEIGHT, CANVAS_WIDTH, COLORS } from "@/game/constants";
import { drawText, textWidth } from "@/game/sprites";
import { FONT, GLYPH_HEIGHT, GLYPH_WIDTH } from "@/game/sprites/arcade";

const HUD_PIXEL_SIZE = 2;
const HUD_MARGIN = 8;
const HUD_VALUE_Y = HUD_MARGIN + (GLYPH_HEIGHT + 2) * HUD_PIXEL_SIZE;

export function drawHud(ctx: CanvasRenderingContext2D, score: number, lives: number): void {
  drawText(ctx, "SCORE", HUD_MARGIN, HUD_MARGIN, HUD_PIXEL_SIZE, COLORS.white, FONT, GLYPH_WIDTH);
  drawText(ctx, String(score).padStart(4, "0"), HUD_MARGIN, HUD_VALUE_Y, HUD_PIXEL_SIZE, COLORS.green, FONT, GLYPH_WIDTH);

  const livesLabelWidth = textWidth("LIVES", GLYPH_WIDTH, HUD_PIXEL_SIZE);
  drawText(ctx, "LIVES", CANVAS_WIDTH - HUD_MARGIN - livesLabelWidth, HUD_MARGIN, HUD_PIXEL_SIZE, COLORS.white, FONT, GLYPH_WIDTH);

  const livesValue = String(lives);
  const livesValueWidth = textWidth(livesValue, GLYPH_WIDTH, HUD_PIXEL_SIZE);
  drawText(ctx, livesValue, CANVAS_WIDTH - HUD_MARGIN - livesValueWidth, HUD_VALUE_Y, HUD_PIXEL_SIZE, COLORS.green, FONT, GLYPH_WIDTH);
}

export function drawGameOverOverlay(ctx: CanvasRenderingContext2D): void {
  const pixelSize = 3;
  const text = "GAME OVER";
  const width = textWidth(text, GLYPH_WIDTH, pixelSize);
  drawText(ctx, text, (CANVAS_WIDTH - width) / 2, CANVAS_HEIGHT / 2 - 20, pixelSize, COLORS.coral, FONT, GLYPH_WIDTH);
}
