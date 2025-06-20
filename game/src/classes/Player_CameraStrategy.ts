import type { Player } from '@actors/Players/Player';
import { SCALE } from '@constants';
import type { IndoorMap } from '@maps/Indoor.js';
import * as ex from 'excalibur';

export class Player_CameraStrategy {
  target: ex.Actor;
  position: ex.Vector;
  map: { tileWidth: number; tileHeight: number };
  constructor(
    target: ex.Actor,
    map: { tileWidth: number; tileHeight: number },
  ) {
    this.target = target;
    this.position = new ex.Vector(this.target.pos.x, this.target.pos.y);
    this.map = map;
  }

  action() {
    const SPEED = 0.08;

    const distance = this.position.distance(this.target.pos);
    if (distance > 2) {
      this.position.x = lerp(this.position.x, this.target.pos.x, SPEED);
      this.position.y = lerp(this.position.y, this.target.pos.y, SPEED);
    }

    // Limits
    const R_LIMIT = this.map.tileWidth * SCALE * 16 - 7 * SCALE * 16;
    this.position.x = this.position.x > R_LIMIT ? R_LIMIT : this.position.x;

    const L_LIMIT = 8 * SCALE * 16;
    this.position.x = this.position.x < L_LIMIT ? L_LIMIT : this.position.x;

    const D_LIMIT = this.map.tileHeight * SCALE * 16 - 5 * SCALE * 16;
    this.position.y = this.position.y > D_LIMIT ? D_LIMIT : this.position.y;

    const U_LIMIT = 7 * SCALE * 16;
    this.position.y = this.position.y < U_LIMIT ? U_LIMIT : this.position.y;

    return this.position;
  }
}

function lerp(
  currentValue: number,
  destinationValue: number,
  time: number,
): number {
  return currentValue * (1 - time) + destinationValue * time;
}
