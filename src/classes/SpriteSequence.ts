interface SpriteSequenceFrame<T> {
  frame: ex.Animation | ex.Sprite;
  duration: number;
  actorObjCallback?: (actorObject: T) => void;
}

export class SpriteSequence<T = unknown> {
  type: string;
  frameAnims: SpriteSequenceFrame<T>[];
  currentFrameIndex: number;
  currentFrameProgress: number;
  isDone: boolean;
  onDone: (actorObject: T) => void;
  actorObject: T | null;

  constructor(
    type: string,
    frameAnims: SpriteSequenceFrame<T>[],
    onDone: (actorObject: T) => void
  ) {
    this.type = type;
    this.frameAnims = frameAnims;
    this.currentFrameIndex = 0;
    this.currentFrameProgress = 0;
    this.isDone = false;
    this.onDone = () => {
      this.isDone = true;
      onDone(this.actorObject as T);
    };
    this.actorObject = null;
  }

  get frame() {
    return this.frameAnims[this.currentFrameIndex].frame;
  }

  work(delta: number) {
    if (this.isDone) {
      return;
    }

    const currentFrameDuration =
      this.frameAnims[this.currentFrameIndex].duration;

    // Work on current frame
    if (this.currentFrameProgress < currentFrameDuration) {
      this.currentFrameProgress += delta;
      return;
    }

    if (this.currentFrameIndex + 1 < this.frameAnims.length) {
      this.currentFrameIndex += 1;
      this.currentFrameProgress = 0;
      // Do new frame callback
      const nextConfig = this.frameAnims[this.currentFrameIndex];
      if (nextConfig.actorObjCallback) {
        nextConfig.actorObjCallback(this.actorObject as T);
      }
      return;
    }
    this.onDone(this.actorObject as T);
  }
}
