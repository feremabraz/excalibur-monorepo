import { DOWN, type Direction, LEFT, RIGHT, UP } from '@constants';
import { Keys } from 'excalibur';

export class DirectionQueue {
  heldDirections: Direction[];

  constructor() {
    this.heldDirections = [];
  }

  get direction(): Direction | null {
    return this.heldDirections[0] ?? null;
  }

  add(dir: Direction) {
    const exists = this.heldDirections.includes(dir);
    if (exists) {
      return;
    }
    this.heldDirections.unshift(dir);
  }

  remove(dir: Direction) {
    this.heldDirections = this.heldDirections.filter((d) => d !== dir);
  }

  update(engine: ex.Engine) {
    for (const group of [
      { key: Keys.Left, dir: LEFT },
      { key: Keys.Right, dir: RIGHT },
      { key: Keys.Up, dir: UP },
      { key: Keys.Down, dir: DOWN },
    ]) {
      if (engine.input.keyboard.wasPressed(group.key)) {
        this.add(group.dir);
      }
      if (engine.input.keyboard.wasReleased(group.key)) {
        this.remove(group.dir);
      }
    }
  }
}
