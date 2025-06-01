import type * as ex from "excalibur";
import type { Player } from "@actors/Players/Player";
import { PAIN, WALK } from "@constants";

export class PlayerAnimations {
	actor: Player;

	constructor(actor: Player) {
		this.actor = actor;
	}

	// Pass game loop delta time into the actionAnimation. Consuming time progresses the frames
	progressThroughActionAnimation(delta: number): void {
		const { actor } = this;
		if (
			actor.actionAnimation &&
			typeof actor.actionAnimation === "object" &&
			actor.actionAnimation &&
			"work" in actor.actionAnimation
		) {
			actor.vel.x = 0; // Freeze in place
			actor.vel.y = 0;
			(actor.actionAnimation as { work: (delta: number) => void }).work(delta);
		}
	}

	showRelevantAnim(): void {
		const { actor } = this;

		// Always prioritize showing PAIN if we are in pain.
		if (
			("hasGhostPainState" in actor && actor.hasGhostPainState) ||
			("painState" in actor && actor.painState)
		) {
			actor.graphics.use(actor.skinAnims[actor.facing][PAIN]);
			return;
		}

		// If a dedicated action is happening, use that.
		if (
			actor.actionAnimation &&
			typeof actor.actionAnimation === "object" &&
			actor.actionAnimation &&
			"frame" in actor.actionAnimation
		) {
			actor.graphics.use(
				(actor.actionAnimation as { frame: ex.Animation | ex.Sprite }).frame,
			);
			return;
		}

		// Use correct directional frame
		actor.graphics.use(actor.skinAnims[actor.facing][WALK]);

		// Use animating version if we are moving
		const walkingMsLeft =
			"walkingMsLeft" in actor && typeof actor.walkingMsLeft === "number"
				? actor.walkingMsLeft
				: 0;
		if (actor.vel.x !== 0 || actor.vel.y !== 0 || walkingMsLeft > 0) {
			if (
				actor.graphics.current &&
				typeof (actor.graphics.current as unknown as { play?: () => void })
					.play === "function"
			) {
				(actor.graphics.current as unknown as { play: () => void }).play();
			}
			return;
		}

		// Otherwise, park at frame 0 for standing still
		if (
			actor.graphics.current &&
			typeof (actor.graphics.current as unknown as { pause?: () => void })
				.pause === "function" &&
			typeof (
				actor.graphics.current as unknown as { goToFrame?: (n: number) => void }
			).goToFrame === "function"
		) {
			(actor.graphics.current as unknown as { pause: () => void }).pause();
			(
				actor.graphics.current as unknown as { goToFrame: (n: number) => void }
			).goToFrame(0);
		}
	}
}
