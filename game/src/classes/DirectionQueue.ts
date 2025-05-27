import { Keys } from "excalibur";
import { LEFT, RIGHT, UP, DOWN } from "@constants";

export class DirectionQueue {
	heldDirections: string[];

	constructor() {
		this.heldDirections = [];
	}

	get direction() {
		return this.heldDirections[0] ?? null;
	}

	add(dir: string) {
		const exists = this.heldDirections.includes(dir);
		if (exists) {
			return;
		}
		this.heldDirections.unshift(dir);
	}

	remove(dir: string) {
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
