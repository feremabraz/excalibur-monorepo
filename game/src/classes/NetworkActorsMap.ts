import type { Engine } from "excalibur";
import { NetworkPlayer } from "@actors/Players/NetworkPlayer";
import {
	EVENT_NETWORK_MONSTER_UPDATE,
	EVENT_NETWORK_PLAYER_LEAVE,
	EVENT_NETWORK_PLAYER_UPDATE,
} from "@constants";
import { NetworkMonster } from "@actors/Monster/NetworkMonster";

// Manages Actors that display state of other connected Players
export class NetworkActorsMap {
	engine: Engine;
	playerMap: Map<string, NetworkPlayer | NetworkMonster>;

	constructor(engine: Engine) {
		this.engine = engine;
		this.playerMap = new Map<string, NetworkPlayer | NetworkMonster>();

		this.engine.on(EVENT_NETWORK_PLAYER_UPDATE, (event: unknown) => {
			const otherPlayer = event as { id: string; data: string };
			this.onUpdatedPlayer(otherPlayer.id, otherPlayer.data);
		});

		this.engine.on(EVENT_NETWORK_MONSTER_UPDATE, (event: unknown) => {
			const content = event as string;
			this.onUpdatedMonster(content);
		});

		this.engine.on(EVENT_NETWORK_PLAYER_LEAVE, (event: unknown) => {
			const otherPlayerIdWhoLeft = event as string;
			this.removePlayer(otherPlayerIdWhoLeft);
		});
	}

	onUpdatedPlayer(id: string, content: string): void {
		// Decode what was sent here
		const [
			actionType,
			x,
			y,
			velX,
			velY,
			skinId,
			facing,
			isInPain,
			isPainFlashing,
		] = content.split("|");

		type SkinId = "RED" | "BLUE" | "GRAY" | "YELLOW";
		type StateUpdate = {
			actionType: string;
			x: number;
			y: number;
			skinId: SkinId;
			facing: string;
			isInPain: boolean;
			isPainFlashing: boolean;
			velX?: number;
			velY?: number;
		};
		const stateUpdate: StateUpdate = {
			actionType,
			x: Number(x),
			y: Number(y),
			skinId: skinId as SkinId,
			facing,
			isInPain: isInPain === "true",
			isPainFlashing: isPainFlashing === "true",
		};

		if (isInPain) {
			stateUpdate.velX = Number(velX);
			stateUpdate.velY = Number(velY);
		}

		let otherPlayerActor = this.playerMap.get(id) as NetworkPlayer | undefined;
		if (!otherPlayerActor) {
			otherPlayerActor = new NetworkPlayer(stateUpdate.x, stateUpdate.y);
			this.playerMap.set(id, otherPlayerActor);
			this.engine.add(otherPlayerActor);
		}

		otherPlayerActor.onStateUpdate(stateUpdate);
	}

	// Called when this id disconnects
	removePlayer(id: string): void {
		const actorToRemove = this.playerMap.get(id);
		if (actorToRemove) {
			actorToRemove.kill();
		}
		this.playerMap.delete(id);
	}

	onUpdatedMonster(content: string): void {
		const [_type, networkId, x, y, _velX, _velY, facing, hasPainState, hp] =
			content.split("|");

		let networkActor = this.playerMap.get(networkId) as
			| NetworkMonster
			| undefined;

		// Add new if it doesn't exist
		if (!networkActor) {
			// Convert x and y to numbers
			networkActor = new NetworkMonster(Number(x), Number(y));
			this.playerMap.set(networkId, networkActor);
			this.engine.add(networkActor);
		}

		//Update the node ("Puppet style")
		networkActor.pos.x = Number(x);
		networkActor.pos.y = Number(y);
		networkActor.facing = facing;
		networkActor.hasPainState = hasPainState === "true";

		// Destroy if gone
		if (Number(hp) <= 0) {
			networkActor.tookFinalDamage();
			this.playerMap.delete(networkId);
		}
	}
}
