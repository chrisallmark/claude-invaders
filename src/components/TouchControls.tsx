"use client";

import type { InputManager } from "@/game/input";
import styles from "./TouchControls.module.css";

export default function TouchControls({ inputManager }: { inputManager: InputManager }) {
  return (
    <div className={styles.controls}>
      <button
        className={styles.button}
        onPointerDown={() => inputManager.setLeft(true)}
        onPointerUp={() => inputManager.setLeft(false)}
        onPointerLeave={() => inputManager.setLeft(false)}
        onPointerCancel={() => inputManager.setLeft(false)}
        aria-label="Move left"
      >
        ◀
      </button>
      <button
        className={styles.button}
        onPointerDown={() => inputManager.setFire(true)}
        onPointerUp={() => inputManager.setFire(false)}
        onPointerLeave={() => inputManager.setFire(false)}
        onPointerCancel={() => inputManager.setFire(false)}
        aria-label="Fire"
      >
        ●
      </button>
      <button
        className={styles.button}
        onPointerDown={() => inputManager.setRight(true)}
        onPointerUp={() => inputManager.setRight(false)}
        onPointerLeave={() => inputManager.setRight(false)}
        onPointerCancel={() => inputManager.setRight(false)}
        aria-label="Move right"
      >
        ▶
      </button>
    </div>
  );
}
