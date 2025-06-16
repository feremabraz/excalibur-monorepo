import { loader } from '@/loader';
import { MainScene } from '@scenes/Main';
import { SplashScene } from '@scenes/Splash';
import * as ex from 'excalibur';

const game = new ex.Engine({
  displayMode: ex.DisplayMode.FillScreen,
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
