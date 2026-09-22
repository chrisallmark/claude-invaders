"use client";

import { useEffect, useRef, useState } from "react";
import { AudioManager } from "@/game/audio";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FIXED_STEP_MS } from "@/game/constants";
import { GameEngine } from "@/game/engine";
import { InputManager } from "@/game/input";
import TouchControls from "@/components/TouchControls";

// The bezel background image and where the game screen sits within it, all
// measured against the image's native pixel dimensions so the overlay stays
// correctly positioned/scaled however large the image renders on screen.
const BEZEL_IMAGE_SIZE = 4000;
const BEZEL_SCREEN_TOP = 1460;
const BEZEL_SCREEN_WIDTH = 1796;
const BEZEL_SCREEN_HEIGHT = 2052;
const BEZEL_SCREEN_LEFT = (BEZEL_IMAGE_SIZE - BEZEL_SCREEN_WIDTH) / 2;

const screenTopPct = `${(BEZEL_SCREEN_TOP / BEZEL_IMAGE_SIZE) * 100}%`;
const screenLeftPct = `${(BEZEL_SCREEN_LEFT / BEZEL_IMAGE_SIZE) * 100}%`;
const screenWidthPct = `${(BEZEL_SCREEN_WIDTH / BEZEL_IMAGE_SIZE) * 100}%`;
const screenHeightPct = `${(BEZEL_SCREEN_HEIGHT / BEZEL_IMAGE_SIZE) * 100}%`;

export default function GameShell() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inputManager] = useState(() => new InputManager());
  const [audioManager] = useState(() => new AudioManager());

  useEffect(() => inputManager.attachKeyboard(), [inputManager]);

  useEffect(() => {
    const unlock = () => audioManager.unlock();
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => {
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("pointerdown", unlock);
    };
  }, [audioManager]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed 4x backing store (896x1024), rather than the runtime
    // devicePixelRatio — that varies per display/zoom and can end up
    // inconsistent, making every sprite pixel look chunkier than intended.
    const BACKING_STORE_SCALE = 4;
    canvas.width = CANVAS_WIDTH * BACKING_STORE_SCALE;
    canvas.height = CANVAS_HEIGHT * BACKING_STORE_SCALE;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(BACKING_STORE_SCALE, BACKING_STORE_SCALE);

    const engine = new GameEngine(inputManager.state, audioManager);
    let rafId = 0;
    let lastTime = performance.now();
    let accumulator = 0;
    // Caps how much simulated time a single real frame can catch up on, so a
    // backgrounded tab or a slow first frame can't dump a huge backlog of
    // ticks into the game logic all at once (a "spiral of death").
    const MAX_FRAME_DELTA_MS = 250;

    const frame = (now: number) => {
      accumulator += Math.min(now - lastTime, MAX_FRAME_DELTA_MS);
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
  }, [inputManager, audioManager]);

  return (
    <>
      <div style={{ position: "relative", height: "100vh", display: "inline-block" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative background, no responsive srcset needed */}
        <img
          src="/images/claude-invaders.png"
          alt=""
          draggable={false}
          style={{ height: "100%", width: "auto", display: "block", pointerEvents: "none", userSelect: "none" }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: screenTopPct,
            left: screenLeftPct,
            width: screenWidthPct,
            height: screenHeightPct,
            imageRendering: "pixelated",
          }}
        />
      </div>
      <TouchControls inputManager={inputManager} />
    </>
  );
}
