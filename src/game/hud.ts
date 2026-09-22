import { CANVAS_HEIGHT, CANVAS_WIDTH, COLORS, SCREEN_EDGE_MARGIN } from "@/game/constants";
import { drawSprite, drawText, textWidth } from "@/game/sprites";
import { FONT, GLYPH_HEIGHT, GLYPH_WIDTH, UFO_SHIP } from "@/game/sprites/arcade";
import { ALIEN_SPRITES } from "@/game/sprites/claudeAliens";

const HUD_PIXEL_SIZE = 1;
const HUD_MARGIN = SCREEN_EDGE_MARGIN;
const HUD_VALUE_Y = HUD_MARGIN + (GLYPH_HEIGHT + 2) * HUD_PIXEL_SIZE;

export function drawHud(ctx: CanvasRenderingContext2D, score: number, lives: number, highScore: number): void {
  drawText(ctx, "SCORE", HUD_MARGIN, HUD_MARGIN, HUD_PIXEL_SIZE, COLORS.white, FONT, GLYPH_WIDTH);
  drawText(ctx, String(score).padStart(4, "0"), HUD_MARGIN, HUD_VALUE_Y, HUD_PIXEL_SIZE, COLORS.green, FONT, GLYPH_WIDTH);

  const hiScoreLabelWidth = textWidth("HI-SCORE", GLYPH_WIDTH, HUD_PIXEL_SIZE);
  drawText(ctx, "HI-SCORE", (CANVAS_WIDTH - hiScoreLabelWidth) / 2, HUD_MARGIN, HUD_PIXEL_SIZE, COLORS.white, FONT, GLYPH_WIDTH);
  const hiScoreValue = String(highScore).padStart(4, "0");
  const hiScoreValueWidth = textWidth(hiScoreValue, GLYPH_WIDTH, HUD_PIXEL_SIZE);
  drawText(ctx, hiScoreValue, (CANVAS_WIDTH - hiScoreValueWidth) / 2, HUD_VALUE_Y, HUD_PIXEL_SIZE, COLORS.green, FONT, GLYPH_WIDTH);

  const livesLabelWidth = textWidth("LIVES", GLYPH_WIDTH, HUD_PIXEL_SIZE);
  drawText(ctx, "LIVES", CANVAS_WIDTH - HUD_MARGIN - livesLabelWidth, HUD_MARGIN, HUD_PIXEL_SIZE, COLORS.white, FONT, GLYPH_WIDTH);

  const livesValue = String(lives);
  const livesValueWidth = textWidth(livesValue, GLYPH_WIDTH, HUD_PIXEL_SIZE);
  drawText(ctx, livesValue, CANVAS_WIDTH - HUD_MARGIN - livesValueWidth, HUD_VALUE_Y, HUD_PIXEL_SIZE, COLORS.green, FONT, GLYPH_WIDTH);
}

function drawCentered(ctx: CanvasRenderingContext2D, text: string, y: number, pixelSize: number, color: string): void {
  const width = textWidth(text, GLYPH_WIDTH, pixelSize);
  drawText(ctx, text, (CANVAS_WIDTH - width) / 2, y, pixelSize, color, FONT, GLYPH_WIDTH);
}

export function drawGameOverOverlay(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, CANVAS_HEIGHT / 2 - 30, CANVAS_WIDTH, 70);

  drawCentered(ctx, "GAME OVER", CANVAS_HEIGHT / 2 - 20, 3, COLORS.coral);
  drawCentered(ctx, "PRESS FIRE TO CONTINUE", CANVAS_HEIGHT / 2 + 20, 1, COLORS.white);
}

const TABLE_PIXEL_SIZE = 1;
const TABLE_ICON_SLOT_X = 56;
const TABLE_ICON_SLOT_WIDTH = 16;
const TABLE_TEXT_X = TABLE_ICON_SLOT_X + TABLE_ICON_SLOT_WIDTH + 2;

function drawScoreTableRow(
  ctx: CanvasRenderingContext2D,
  y: number,
  icon: number[][],
  iconColor: string,
  text: string,
  textColor: string,
): void {
  const iconWidth = icon[0].length * TABLE_PIXEL_SIZE;
  const iconHeight = icon.length * TABLE_PIXEL_SIZE;
  const iconX = TABLE_ICON_SLOT_X + TABLE_ICON_SLOT_WIDTH - iconWidth;
  const iconY = y + (GLYPH_HEIGHT * TABLE_PIXEL_SIZE - iconHeight) / 2;
  drawSprite(ctx, icon, iconX, iconY, TABLE_PIXEL_SIZE, ["transparent", iconColor]);
  drawText(ctx, text, TABLE_TEXT_X, y, TABLE_PIXEL_SIZE, textColor, FONT, GLYPH_WIDTH);
}

export function drawAttractScreen(ctx: CanvasRenderingContext2D): void {
  drawCentered(ctx, "PLAY", 16, 1, COLORS.white);
  drawCentered(ctx, "CLAUDE INVADERS", 40, 2, COLORS.coral);

  drawCentered(ctx, "*SCORE ADVANCE TABLE*", 70, 1, COLORS.white);
  drawScoreTableRow(ctx, 86, UFO_SHIP, COLORS.red, "= ? MYSTERY", COLORS.white);
  drawScoreTableRow(ctx, 100, ALIEN_SPRITES[0][0], COLORS.coral, "= 30 POINTS", COLORS.white);
  drawScoreTableRow(ctx, 114, ALIEN_SPRITES[1][0], COLORS.coral, "= 20 POINTS", COLORS.white);
  drawScoreTableRow(ctx, 128, ALIEN_SPRITES[2][0], COLORS.coral, "= 10 POINTS", COLORS.white);

  drawCentered(ctx, "PRESS FIRE TO START", CANVAS_HEIGHT - 20, 1, COLORS.white);
}
