import * as ex from "excalibur";
import { SCALE_2x } from "@constants";
import { Images } from "@resources";

const spriteSheet = ex.SpriteSheet.fromImageSource({
	image: Images.explosionSheetImage,
	grid: {
		columns: 7,
		rows: 1,
		spriteWidth: 32,
		spriteHeight: 32,
	},
});

const EXPLOSION_ANIM_SPEED = 80;

export class Explosion extends ex.Actor {
	constructor(x: number, y: number) {
		super({
			pos: new ex.Vector(x, y),
			width: 32,
			height: 32,
			scale: SCALE_2x,
		});

		// Do the animation, then remove instance after it's done
		const explodeAnim = ex.Animation.fromSpriteSheet(
			spriteSheet,
			ex.range(0, 6),
			EXPLOSION_ANIM_SPEED,
		);
		explodeAnim.strategy = ex.AnimationStrategy.End;

		this.graphics.add("explode", explodeAnim);
		const graphic = this.graphics.getGraphic("explode");
		if (graphic && graphic instanceof ex.Animation) {
			graphic.events.on("loop", () => {
				this.kill();
			});
		}
		this.graphics.use(explodeAnim);
	}
}
