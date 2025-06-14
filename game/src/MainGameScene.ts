import * as ex from "excalibur";
import { Map_Indoor } from "@maps/Map_Indoor";
import { Player } from "@actors/Players/Player";
import { Player_CameraStrategy } from "@classes/Player_CameraStrategy";
import { Monster } from "@actors/Monster/Monster";
import { TAG_ANY_PLAYER } from "@constants";
import { UIElementStyles } from "./styles";

export class MainGameScene extends ex.Scene {
	player!: Player;

	override onInitialize(engine: ex.Engine): void {
		const map = new Map_Indoor();
		this.add(map);

		this.player = new Player(200, 200, "RED");
		this.add(this.player);

		// Camera follows player
		const cameraStrategy = new Player_CameraStrategy(this.player, map);
		engine.currentScene.camera.addStrategy(cameraStrategy);

		// Set up ability to query for certain actors on the fly
		engine.currentScene.world.queryManager.createQuery([
			TAG_ANY_PLAYER as unknown as ex.ComponentCtor<ex.Component>,
		]);

		// Create Monster button
		const createAddMonsterButton = () => {
			const button = document.createElement("button");
			button.onclick = () => {
				const monster = new Monster(100, 100);
				engine.add(monster);
			};
			button.onkeydown = (e) => {
				// Prevent spacebar from triggering the button
				if (e.key === " ") {
					e.preventDefault();
				}
			};
			// Apply styles from UIElementStyles
			Object.assign(button.style, UIElementStyles.Button);
			button.innerText = "ADD MONSTER";
			document.body.append(button);
		};
		createAddMonsterButton();
	}
}
