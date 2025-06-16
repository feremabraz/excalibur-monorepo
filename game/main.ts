import { loader } from '@/loader';
import { MainScene } from '@scenes/Main';
import { SplashScene } from '@scenes/Splash';
import * as ex from 'excalibur';

const game = new ex.Engine({
  width: 208 * 2,
  height: 192 * 2,
  fixedUpdateFps: 60,
  antialiasing: false,
  scenes: {
    splash: SplashScene,
    main: MainScene,
  },
});

game.start(loader).then(() => {
  game.goToScene('splash');
});
