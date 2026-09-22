export type SoundKey =
  | "shoot"
  | "explosion"
  | "invaderKilled"
  | "ufo"
  | "march1"
  | "march2"
  | "march3"
  | "march4"
  | "extendPlay";

const SOUND_FILES: Record<SoundKey, string> = {
  shoot: "/sounds/shoot.wav",
  explosion: "/sounds/explosion.wav",
  invaderKilled: "/sounds/invader-killed.wav",
  ufo: "/sounds/ufo.wav",
  march1: "/sounds/march-1.wav",
  march2: "/sounds/march-2.wav",
  march3: "/sounds/march-3.wav",
  march4: "/sounds/march-4.wav",
  extendPlay: "/sounds/extend-play.wav",
};

const MARCH_SEQUENCE: SoundKey[] = ["march1", "march2", "march3", "march4"];

// Web Audio (not HTMLAudioElement) for low-latency one-shots and clean
// looping. Must be unlocked from a real user gesture (browser autoplay
// policy) before any sound plays.
export class AudioManager {
  private context: AudioContext | null = null;
  private readonly buffers = new Map<SoundKey, AudioBuffer>();
  private marchIndex = 0;
  private ufoSource: AudioBufferSourceNode | null = null;

  unlock(): void {
    if (this.context) return;
    this.context = new AudioContext();
    void this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const context = this.context;
    if (!context) return;
    await Promise.all(
      (Object.keys(SOUND_FILES) as SoundKey[]).map(async (key) => {
        try {
          const response = await fetch(SOUND_FILES[key]);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          this.buffers.set(key, audioBuffer);
        } catch {
          // A missing/undecodable sample shouldn't break gameplay.
        }
      }),
    );
  }

  playOneShot(key: SoundKey): void {
    if (!this.context) return;
    const buffer = this.buffers.get(key);
    if (!buffer) return;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start();
  }

  stepMarch(): void {
    this.playOneShot(MARCH_SEQUENCE[this.marchIndex]);
    this.marchIndex = (this.marchIndex + 1) % MARCH_SEQUENCE.length;
  }

  startUfoLoop(): void {
    if (!this.context) return;
    const buffer = this.buffers.get("ufo");
    if (!buffer) return;
    this.stopUfoLoop();
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.context.destination);
    source.start();
    this.ufoSource = source;
  }

  stopUfoLoop(): void {
    if (!this.ufoSource) return;
    this.ufoSource.stop();
    this.ufoSource.disconnect();
    this.ufoSource = null;
  }
}
