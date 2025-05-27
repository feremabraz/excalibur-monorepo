import * as ex from "excalibur";
import { Map_Indoor } from "@maps/Map_Indoor";
import { Player } from "@actors/Players/Player";
import { Player_CameraStrategy } from "@classes/Player_CameraStrategy";
import { NetworkClient } from "@classes/NetworkClient";
import { NetworkActorsMap } from "@classes/NetworkActorsMap";
import { Monster } from "@actors/Monster/Monster";
import {
  TAG_ANY_PLAYER,
  EVENT_SEND_PLAYER_UPDATE,
  EVENT_SEND_MONSTER_UPDATE,
} from "@constants";

export class MainGameScene extends ex.Scene {
  player!: Player;
  peer!: NetworkClient;

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

    // Create player state list and network listener
    new NetworkActorsMap(engine);
    this.peer = new NetworkClient(engine);

    // When one of my nodes updates, send it to all peers
    engine.on(EVENT_SEND_PLAYER_UPDATE, (update) => {
      this.peer.sendUpdate(String(update));
    });
    engine.on(EVENT_SEND_MONSTER_UPDATE, (update) => {
      this.peer.sendUpdate(String(update));
    });

    // Create Monster button
    const createAddMonsterButton = () => {
      const button = document.createElement("button");
      button.onclick = () => {
        const monster = new Monster(100, 100);
        engine.add(monster);
      };
      button.style.display = "block";
      button.innerText = "ADD MONSTER";
      document.body.append(button);
    };
    createAddMonsterButton();
  }
}
