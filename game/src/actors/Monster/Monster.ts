import * as ex from "excalibur";
import {
	WALK,
	PAIN,
	ANCHOR_CENTER,
	SCALE_2x,
	TAG_ANY_PLAYER,
	DOWN,
	RIGHT,
	LEFT,
	UP,
	TAG_DAMAGES_PLAYER,
	EVENT_INITIAL_DATA_REQUESTED,
	EVENT_SEND_MONSTER_UPDATE,
	SCALE,
	TAG_PLAYER_WEAPON,
} from "@constants";
import { guidGenerator, randomFromArray } from "@helpers";
import { generateMonsterAnimations } from "@character-animations";
import { NetworkUpdater } from "@classes/NetworkUpdater";
import { Explosion } from "@actors/Explosion";
import type { Direction } from "@constants";

const MONSTER_WALK_VELOCITY = 30;
const MONSTER_CHASE_VELOCITY = 65;
const MONSTER_DETECT_PLAYER_RANGE = 150;

export class Monster extends ex.Actor {
	networkId: string;
	painState: { msLeft: number; velX: number; velY: number } | null;
	roamingPoint: ex.Vector | null;
	target: ex.Actor | null;
	hp: number;
	facing: Direction;
	anims: Record<string, Record<string, ex.Animation>>;
	networkUpdater!: NetworkUpdater;
	constructor(x: number, y: number) {
		super({
			pos: new ex.Vector(x, y),
			width: 16,
			height: 16,
			scale: SCALE_2x,
			collisionType: ex.CollisionType.Active,
		});
		this.networkId = guidGenerator();
		this.painState = null;
		this.roamingPoint = null;
		this.target = null;
		this.hp = 3;
		this.facing = DOWN;
		this.anims = generateMonsterAnimations();
		// Set collider after construction
		this.collider.set(ex.Shape.Box(11, 10, ANCHOR_CENTER, new ex.Vector(0, 4)));
		this.on("collisionstart", (evt: ex.CollisionStartEvent) => {
			const other = evt.other as unknown as ex.Actor & {
				isUsed?: boolean;
				hasTag?: (tag: string) => boolean;
				onDamagedSomething?: () => void;
				direction?: Direction;
			};
			if (
				other &&
				typeof other.isUsed !== "undefined" &&
				other.hasTag &&
				other.hasTag(TAG_PLAYER_WEAPON)
			) {
				if (other.isUsed) {
					return;
				}
				other.onDamagedSomething?.();
				if (other.direction) {
					this.takeDamage(other.direction);
				}
			}
		});
	}

	onInitialize(engine: ex.Engine) {
		//new DrawShapeHelper(this);

		// Add to enemy group
		this.addTag(TAG_DAMAGES_PLAYER);

		// Choose random roaming point
		this.chooseRoamingPoint();

		// Periodically query for a new target
		void this.queryForTarget();

		// Send network updates on move
		this.networkUpdater = new NetworkUpdater(engine, EVENT_SEND_MONSTER_UPDATE);
	}

	takeDamage(otherDirection: Direction) {
		if (this.painState) {
			return;
		}

		// Reduce HP
		this.hp -= 1;

		// Check for death
		if (this.hp === 0) {
			this.kill();
			const expl = new Explosion(this.pos.x, this.pos.y);
			this.scene?.engine?.add(expl);

			// Emit that we died. It matters otherwise other players don't hear about HP being 0
			const networkUpdateStr = this.createNetworkUpdateString();
			this.networkUpdater.sendStateUpdate(networkUpdateStr);
			return;
		}

		let x = this.vel.x * -1;
		if (otherDirection === LEFT) {
			x = -300;
		}
		if (otherDirection === RIGHT) {
			x = 300;
		}
		let y = this.vel.y * -1;
		if (otherDirection === DOWN) {
			y = 300;
		}
		if (otherDirection === UP) {
			y = -300;
		}

		this.painState = {
			msLeft: 100,
			velX: x,
			velY: y,
		};
	}

	createNetworkUpdateString(): string {
		const hasPainState = Boolean(this.painState);
		const x = Math.round(this.pos.x);
		const y = Math.round(this.pos.y);
		return `MONSTER|${this.networkId}|${x}|${y}|${this.vel.x}|${this.vel.y}|${this.facing}|${hasPainState}|${this.hp}`;
	}

	async queryForTarget(): Promise<void> {
		// If we don't have a valid target
		if (!this.target || this.target?.isKilled()) {
			// Query all players on the map
			const playersQuery = this.scene?.world?.queryManager?.createTagQuery([
				TAG_ANY_PLAYER,
			]);
			if (!playersQuery) return;
			// Filter down to nearby ones within pixel range
			const nearbyPlayers = playersQuery.getEntities().filter((actor) => {
				// Type assertion to ex.Actor for type safety
				const exActor = actor as ex.Actor;
				if (!exActor.pos) return false;
				const actorDistance = this.pos.distance(exActor.pos);
				return actorDistance <= MONSTER_DETECT_PLAYER_RANGE;
			}) as ex.Actor[];
			// If we have results, choose a random one to target
			if (nearbyPlayers.length) {
				this.target = randomFromArray(nearbyPlayers) as ex.Actor;
			}
		}

		// Retry after X seconds
		await this.actions.delay(1500).toPromise();
		await this.queryForTarget();
	}

	chooseRoamingPoint() {
		const possibleRoamingSpots = [
			new ex.Vector(84 * SCALE, 96 * SCALE),
			new ex.Vector(210 * SCALE, 112 * SCALE),
			new ex.Vector(95 * SCALE, 181 * SCALE),
			new ex.Vector(224 * SCALE, 184 * SCALE),
		];
		this.roamingPoint = randomFromArray(possibleRoamingSpots);
	}

	onPreUpdate(engine: ex.Engine, delta: number) {
		if (this.painState) {
			this.vel.x = this.painState.velX;
			this.vel.y = this.painState.velY;
			this.painState.msLeft -= delta;
			if (this.painState.msLeft <= 0) {
				this.painState = null;
			}
		} else {
			if (this.target) {
				this.onPreUpdateMoveTowardsTarget();
			} else {
				this.onPreUpdateMoveTowardsRoamingPoint();
			}
		}

		// Show correct appearance
		this.onPreUpdateAnimation();

		//Update everybody
		const networkUpdateStr = this.createNetworkUpdateString();
		this.networkUpdater.sendStateUpdate(networkUpdateStr);
	}

	onPreUpdateMoveTowardsRoamingPoint() {
		if (!this.roamingPoint) {
			return;
		}

		// Move towards the point if far enough away
		const distance = this.roamingPoint.distance(this.pos);
		if (distance > 5) {
			if (this.pos.x < this.roamingPoint.x) {
				this.vel.x = MONSTER_WALK_VELOCITY;
			}
			if (this.pos.x > this.roamingPoint.x) {
				this.vel.x = -MONSTER_WALK_VELOCITY;
			}
			if (this.pos.y < this.roamingPoint.y) {
				this.vel.y = MONSTER_WALK_VELOCITY;
			}
			if (this.pos.y > this.roamingPoint.y) {
				this.vel.y = -MONSTER_WALK_VELOCITY;
			}
		} else {
			this.chooseRoamingPoint();
		}
	}

	onPreUpdateMoveTowardsTarget() {
		if (!this.target) return;
		const dest = this.target.pos;
		const distance = dest.distance(this.pos);
		if (distance > 5) {
			if (this.pos.x < dest.x) {
				this.vel.x = MONSTER_CHASE_VELOCITY;
			}
			if (this.pos.x > dest.x) {
				this.vel.x = -MONSTER_CHASE_VELOCITY;
			}
			if (this.pos.y < dest.y) {
				this.vel.y = MONSTER_CHASE_VELOCITY;
			}
			if (this.pos.y > dest.y) {
				this.vel.y = -MONSTER_CHASE_VELOCITY;
			}
		}
	}

	faceTowardsPosition(pos: ex.Vector) {
		const xDiff = Math.abs(this.pos.x - pos.x);
		const yDiff = Math.abs(this.pos.y - pos.y);

		// Use axis that has the greatest distance
		if (xDiff > yDiff) {
			this.facing = this.pos.x > pos.x ? LEFT : RIGHT;
		} else {
			this.facing = this.pos.y > pos.y ? UP : DOWN;
		}

		// Choose the correct frame
		const pose = this.painState ? PAIN : WALK;
		this.graphics.use(this.anims[pose][this.facing]);
	}

	onPreUpdateAnimation() {
		if (!this.target && !this.roamingPoint) {
			return;
		}
		const facePosition = this.target
			? this.target.pos
			: (this.roamingPoint as ex.Vector);
		this.faceTowardsPosition(facePosition);
	}
}
