import { Peer } from "peerjs";
import {
	EVENT_INITIAL_DATA_REQUESTED,
	EVENT_NETWORK_MONSTER_UPDATE,
	EVENT_NETWORK_PLAYER_LEAVE,
	EVENT_NETWORK_PLAYER_UPDATE,
} from "@constants";
import { guidGenerator } from "@helpers";
import type { Engine } from "excalibur";
import type { DataConnection, Peer as PeerType } from "peerjs";

const PORT = 9002;
const LOCALHOST_CONFIG = {
	host: "localhost",
	key: "demodemo",
	port: PORT,
	path: "/myapp",
};
const LOCALHOST_URL = `http://localhost:${PORT}`;

const URL = "mock-peerjs-server.onrender.com";
const PRODUCTION_CONFIG = {
	host: URL,
	key: "demodemo",
	port: undefined, // should be number or undefined
	path: "/myapp",
	secure: true,
};

export class NetworkClient {
	peerId: string;
	engine: Engine;
	connectionMap: Map<string, DataConnection>;
	peer!: PeerType;

	constructor(engine: Engine) {
		this.peerId = `Player_${guidGenerator()}`;
		this.engine = engine;
		this.connectionMap = new Map<string, DataConnection>();
		void this.init();
	}

	async init(): Promise<void> {
		this.peer = new Peer(this.peerId, PRODUCTION_CONFIG);

		this.peer.on("error", (err: Error) => {
			console.log(err.message);
		});

		// Be ready to hear from incoming connections
		this.peer.on("connection", async (conn: DataConnection) => {
			conn.on("open", () => {
				this.connectionMap.set(conn.peer, conn);
				this.engine.emit(EVENT_INITIAL_DATA_REQUESTED);
			});
			conn.on("close", () => {
				this.engine.emit(EVENT_NETWORK_PLAYER_LEAVE, conn.peer);
			});
			conn.on("data", (data: unknown) => {
				if (typeof data === "string") {
					this.handleIncomingData(conn, data);
				}
			});
			window.addEventListener("unload", () => {
				conn.close();
			});
		});
		const otherPeerIds = await this.getAllPeerIds();
		await timeout(1000);
		for (let i = 0; i < otherPeerIds.length; i++) {
			const id = otherPeerIds[i];
			const conn = this.peer.connect(id);
			conn.on("open", () => {
				this.connectionMap.set(id, conn);
			});
			conn.on("close", () => {
				this.engine.emit(EVENT_NETWORK_PLAYER_LEAVE, conn.peer);
			});
			conn.on("data", (data: unknown) => {
				if (typeof data === "string") {
					this.handleIncomingData(conn, data);
				}
			});
			window.addEventListener("unload", () => {
				conn.close();
			});
			await timeout(200);
		}
	}

	handleIncomingData(conn: DataConnection, data: string): void {
		// Handle MONSTER updates (detect by prefix)
		if (data.startsWith("MONSTER")) {
			this.engine.emit(EVENT_NETWORK_MONSTER_UPDATE, data);
			return;
		}

		// Handle PLAYER prefix
		this.engine.emit(EVENT_NETWORK_PLAYER_UPDATE, {
			id: conn.peer,
			data,
		});
	}

	async getAllPeerIds(): Promise<string[]> {
		//const response = await fetch(`${LOCALHOST_URL}/myapp/demodemo/peers`);
		const response = await fetch(`https://${URL}/myapp/demodemo/peers`);
		const peersArray: string[] = await response.json();
		const list = peersArray ?? [];
		return list.filter((id: string) => id !== this.peerId);
	}

	sendUpdate(update: string): void {
		for (const conn of this.connectionMap.values()) {
			conn.send(update);
		}
	}
}

function timeout(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
