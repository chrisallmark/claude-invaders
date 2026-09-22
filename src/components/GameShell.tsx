"use client";

import { useEffect, useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from "@/game/constants";
import { drawSprite, drawText, textWidth } from "@/game/sprites";
import { PLAYER_SHIP, FONT, GLYPH_WIDTH } from "@/game/sprites/arcade";

export default function GameShell() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const title = "CLAUDE INVADERS";
    const titlePixelSize = 2;
    const titleX = (CANVAS_WIDTH - textWidth(title, GLYPH_WIDTH, titlePixelSize)) / 2;
    drawText(ctx, title, titleX, 60, titlePixelSize, COLORS.green, FONT, GLYPH_WIDTH);

    const shipPixelSize = 4;
    const shipWidth = PLAYER_SHIP[0].length * shipPixelSize;
    drawSprite(
      ctx,
      PLAYER_SHIP,
      (CANVAS_WIDTH - shipWidth) / 2,
      CANVAS_HEIGHT - 40,
      shipPixelSize,
      ["transparent", COLORS.green],
    );
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        maxWidth: "100vw",
        maxHeight: "100vh",
        width: "auto",
        height: "auto",
        imageRendering: "pixelated",
      }}
    />
  );
}
