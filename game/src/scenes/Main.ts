import { debug } from '@/classes/Debug';
import { Monster } from '@actors/Monster/Monster';
import { Player } from '@actors/Players/Player';
import { Player_CameraStrategy } from '@classes/Player_CameraStrategy';
import { TAG_ANY_PLAYER } from '@constants';
import { IndoorMap } from '@maps/Indoor';
import * as ex from 'excalibur';

export class MainScene extends ex.Scene {
  player!: Player;

  override onInitialize(engine: ex.Engine): void {
    const map = new IndoorMap();
    this.add(map);

    this.player = new Player(200, 200, 'RED');
    this.add(this.player);

    const monster = new Monster(100, 100);
    engine.add(monster);

    // Camera follows player
    const cameraStrategy = new Player_CameraStrategy(this.player, map);
    engine.currentScene.camera.addStrategy(cameraStrategy);

    // Set up ability to query for certain actors on the fly
    engine.currentScene.world.queryManager.createQuery([
      TAG_ANY_PLAYER as unknown as ex.ComponentCtor<ex.Component>,
    ]);
  }

  override onPreUpdate(engine: ex.Engine): void {
    if (debug) {
      engine.showDebug(debug.state.actors);
    }
  }

  override onActivate(): void {
    if (debug) {
      debug.show();
    }
  }

  override onDeactivate(): void {
    if (debug) {
      debug.hide();
    }
  }
}
