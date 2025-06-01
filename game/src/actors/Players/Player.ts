import * as ex from "excalibur";
import {
	ANCHOR_CENTER,
	DOWN,
	LEFT,
	SCALE_2x,
	TAG_ANY_PLAYER,
	TAG_DAMAGES_PLAYER,
	TAG_PLAYER_WEAPON,
	UP,
	type Direction,
} from "@constants";
import { DirectionQueue } from "@classes/DirectionQueue";
import { DrawShapeHelper } from "@classes/DrawShapeHelper";
import { generateCharacterAnimations } from "@character-animations";
import { PlayerAnimations } from "@actors/Players/PlayerAnimations";
import { PlayerActions } from "@actors/Players/PlayerActions";
import { Keys } from "excalibur";

const ACTION_1_KEY = Keys.Z;
const ACTION_2_KEY = Keys.X;

// Type definitions for skin animations
interface CharacterAnimations {
	[direction: string]: {
		[action: string]: ex.Animation | ex.Sprite;
	};
}

interface PainState {
	msLeft: number;
	painVelX: number;
	painVelY: number;
}

export class Player extends ex.Actor {
	public directionQueue: DirectionQueue;
	public facing: Direction;
	public actionAnimation: unknown; // Should be typed more strictly if possible
	public isPainFlashing: boolean;
	public skinId: "RED" | "BLUE" | "GRAY" | "YELLOW";
	public skinAnims: CharacterAnimations;
	public playerAnimations!: PlayerAnimations;
	public playerActions!: PlayerActions;
	public painState: PainState | null = null;

	constructor(
		x: number,
		y: number,
		skinId: "RED" | "BLUE" | "GRAY" | "YELLOW",
	) {
		super({
			pos: new ex.Vector(x, y),
			width: 32,
			height: 32,
			scale: SCALE_2x,
			color: ex.Color.Blue,
			collisionType: ex.CollisionType.Active,
		});
		this.directionQueue = new DirectionQueue();
		this.facing = DOWN;
		this.actionAnimation = null;
		this.isPainFlashing = false;
		this.skinId = skinId;
		this.skinAnims = generateCharacterAnimations(skinId);
		this.graphics.use(this.skinAnims.DOWN.WALK);
		this.addTag(TAG_ANY_PLAYER);
		this.collider.set(ex.Shape.Box(15, 15, ANCHOR_CENTER, new ex.Vector(0, 6)));
		this.on("collisionstart", (evt: ex.CollisionStartEvent) => {
			const other = evt.other as unknown as ex.Actor & {
				hasTag?: (tag: string) => boolean;
			};
			if (other?.hasTag?.(TAG_DAMAGES_PLAYER)) {
				this.takeDamage();
			}
		});
	}

	onInitialize(engine: ex.Engine) {
		new DrawShapeHelper(this);
		this.playerAnimations = new PlayerAnimations(this);
		this.playerActions = new PlayerActions(this);
	}

	takeDamage() {
		// No pain if already in pain
		if (this.isPainFlashing) {
			return;
		}

		// Start a new pain moment
		const PAIN_VELOCITY = 150;
		this.painState = {
			msLeft: 220,
			painVelX: this.facing === LEFT ? PAIN_VELOCITY : -PAIN_VELOCITY,
			painVelY: this.facing === UP ? PAIN_VELOCITY : -PAIN_VELOCITY,
		};

		// Flash for a little bit
		this.playerActions?.flashSeries();
	}

	onPreUpdate(engine: ex.Engine, delta: number) {
		this.directionQueue.update(engine);

		// Work on dedicated animation if we are doing one
		this.playerAnimations.progressThroughActionAnimation(delta);

		if (!this.actionAnimation) {
			this.onPreUpdateMovement(engine, delta);
			this.onPreUpdateActionKeys(engine);
		}

		// Show the right frames
		this.playerAnimations.showRelevantAnim();
	}

	onPreUpdateMovement(engine: ex.Engine, delta: number) {
		// Work down pain state
		if (this.painState) {
			this.vel.x = this.painState.painVelX;
			this.vel.y = this.painState.painVelY;

			// Work on getting rid of pain
			this.painState.msLeft -= delta;
			if (this.painState.msLeft <= 0) {
				this.painState = null;
			}
			return;
		}

		const keyboard = engine.input.keyboard;
		const WALKING_SPEED = 160;

		this.vel.x = 0;
		this.vel.y = 0;
		if (keyboard.isHeld(Keys.Left)) {
			this.vel.x = -1;
		}
		if (keyboard.isHeld(Keys.Right)) {
			this.vel.x = 1;
		}
		if (keyboard.isHeld(Keys.Up)) {
			this.vel.y = -1;
		}
		if (keyboard.isHeld(Keys.Down)) {
			this.vel.y = 1;
		}

		// Normalize walking speed
		if (this.vel.x !== 0 || this.vel.y !== 0) {
			this.vel = this.vel.normalize();
			this.vel.x = this.vel.x * WALKING_SPEED;
			this.vel.y = this.vel.y * WALKING_SPEED;
		}

		this.facing = this.directionQueue.direction ?? this.facing;
	}

	// Type guard for valid skin IDs
	private isValidSkinId(
		skinId: string,
	): skinId is "RED" | "BLUE" | "GRAY" | "YELLOW" {
		return ["RED", "BLUE", "GRAY", "YELLOW"].includes(skinId);
	}

	onPreUpdateActionKeys(engine: ex.Engine) {
		// Register action keys
		if (engine.input.keyboard.wasPressed(ACTION_1_KEY)) {
			this.playerActions.actionSwingSword();
			return;
		}

		if (engine.input.keyboard.wasPressed(ACTION_2_KEY)) {
			this.playerActions.actionShootArrow();
			return;
		}

		// Listen for Number keys to change skin
		for (const { key, skinId } of [
			{ key: Keys.Digit1, skinId: "RED" },
			{ key: Keys.Digit2, skinId: "BLUE" },
			{ key: Keys.Digit3, skinId: "GRAY" },
			{ key: Keys.Digit4, skinId: "YELLOW" },
		]) {
			if (engine.input.keyboard.wasPressed(key)) {
				if (this.isValidSkinId(skinId)) {
					this.skinId = skinId;
					this.skinAnims = generateCharacterAnimations(skinId);
				}
			}
		}

		// JUST FOR Testing, fake pain on SPACE key
		if (engine.input.keyboard.wasPressed(Keys.Space)) {
			this.takeDamage();
		}
	}
}
