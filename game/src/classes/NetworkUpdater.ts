import type { Engine } from "excalibur";

export class NetworkUpdater {
	engine: Engine;
	eventType: string;
	prevStr: string;

	constructor(engine: Engine, eventType: string) {
		this.engine = engine;
		this.eventType = eventType;
		this.prevStr = "";
	}

	sendStateUpdate(newString: string): void {
		if (this.prevStr === newString) {
			return;
		}
		this.engine.emit(this.eventType, newString);
		this.prevStr = newString;
	}
}
