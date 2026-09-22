"use client";

import { useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FIXED_STEP_MS } from "@/game/constants";
import { GameEngine } from "@/game/engine";
import { InputManager } from "@/game/input";
import TouchControls from "@/components/TouchControls";

export default function GameShell() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inputManager] = useState(() => new InputManager());

  useEffect(() => inputManager.attachKeyboard(), [inputManager]);

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

    const engine = new GameEngine(inputManager.state);
    let rafId = 0;
    let lastTime = performance.now();
    let accumulator = 0;

    const frame = (now: number) => {
      accumulator += now - lastTime;
      lastTime = now;
      while (accumulator >= FIXED_STEP_MS) {
        engine.update(FIXED_STEP_MS);
        accumulator -= FIXED_STEP_MS;
      }
      engine.draw(ctx);
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafId);
  }, [inputManager]);

  return (
    <>
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
      <TouchControls inputManager={inputManager} />
    </>
  );
}
