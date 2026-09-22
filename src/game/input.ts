import type { InputState } from "@/game/types";

// A single mutable InputState shared by keyboard and touch input — both
// producers write into the same object, and GameEngine just reads it.
export class InputManager {
  readonly state: InputState = { left: false, right: false, fire: false };

  attachKeyboard(): () => void {
    const handleKeyDown = (event: KeyboardEvent) => this.handleKey(event, true);
    const handleKeyUp = (event: KeyboardEvent) => this.handleKey(event, false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }

  setLeft(pressed: boolean): void {
    this.state.left = pressed;
  }

  setRight(pressed: boolean): void {
    this.state.right = pressed;
  }

  setFire(pressed: boolean): void {
    this.state.fire = pressed;
  }

  private handleKey(event: KeyboardEvent, pressed: boolean): void {
    switch (event.code) {
      case "ArrowLeft":
      case "KeyA":
        this.state.left = pressed;
        break;
      case "ArrowRight":
      case "KeyD":
        this.state.right = pressed;
        break;
      case "Space":
        event.preventDefault();
        this.state.fire = pressed;
        break;
    }
  }
}
