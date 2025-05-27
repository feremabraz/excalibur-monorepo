import { MainGameScene } from "./src/MainGameScene";
import { SplashScene } from "./src/SplashScene";
import { loader } from "./src/resources";
import * as ex from "excalibur";

const game = new ex.Engine({
  width: 208 * 2,
  height: 192 * 2,
  fixedUpdateFps: 60,
  antialiasing: false,
  scenes: {
    splash: SplashScene,
    main: MainGameScene,
  },
});

game.start(loader).then(() => {
  game.goToScene("splash");
});

// Removed monster button logic; handled in MainGameScene
