import * as ex from "excalibur";
import { DOWN, PAIN, SCALE_2x, TAG_DAMAGES_PLAYER, WALK } from "@constants";
import { Explosion } from "@actors/Explosion";
import { generateMonsterAnimations } from "@character-animations";

// Note this class simply shows a known Monster which is controlled by another player.
export class NetworkMonster extends ex.Actor {
	hasPainState: boolean;
	facing: string;
	anims: Record<string, Record<string, ex.Animation>>;

	constructor(x: number, y: number) {
		super({
			pos: new ex.Vector(x, y),
			width: 16,
			height: 16,
			scale: SCALE_2x,
		});
		this.hasPainState = false;
		this.facing = DOWN;
		this.anims = generateMonsterAnimations();
	}

	onInitialize(_engine: ex.Engine): void {
		this.addTag(TAG_DAMAGES_PLAYER);
	}

	tookFinalDamage(): void {
		// Replace me with an explosion when owner client reports I am out of HP
		this.kill();
		this.scene?.engine?.add(new Explosion(this.pos.x, this.pos.y));
	}

	onPreUpdate(_engine: ex.Engine, delta: number): void {
		// Show correct appearance
		const use = this.anims[this.hasPainState ? PAIN : WALK][this.facing];
		this.graphics.use(use);
	}
}
