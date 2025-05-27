import * as ex from "excalibur";
import { ANCHOR_TOP_LEFT, SCALE, SCALE_2x } from "@constants";

// Solid blocks that get placed around map edges
export class Floor extends ex.Actor {
	constructor(x: number, y: number, cols: number, rows: number) {
		const SIZE = 16;

		super({
			width: SIZE * cols,
			height: SIZE * rows,
			pos: new ex.Vector(x * SIZE * SCALE, y * SIZE * SCALE),
			scale: SCALE_2x,
			anchor: ANCHOR_TOP_LEFT,
			collisionType: ex.CollisionType.Fixed,
			color: ex.Color.Red,
		});
		this.graphics.opacity = 0.0;
		this.collider.set(ex.Shape.Box(SIZE * cols, SIZE * rows, ex.Vector.Zero));
	}
}
