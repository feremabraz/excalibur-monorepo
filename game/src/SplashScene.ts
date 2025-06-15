import * as ex from 'excalibur';
import { Colors, GameText } from './styles';

export class SplashScene extends ex.Scene {
  override onInitialize(engine: ex.Engine): void {
    this.backgroundColor = Colors.BACKGROUND_DARK;

    const label = new ex.Label({
      text: 'Zelda-ish Adventure',
      pos: ex.vec(engine.drawWidth / 2, engine.drawHeight / 2 - 20),
      font: GameText.SplashTitleFont,
      anchor: ex.vec(0.5, 0.5),
    });
    this.add(label);

    const subLabel = new ex.Label({
      text: 'Press any key to start',
      pos: ex.vec(engine.drawWidth / 2, engine.drawHeight / 2 + 20),
      font: GameText.SplashSubtitleFont,
      anchor: ex.vec(0.5, 0.5),
    });
    this.add(subLabel);

    this.input.keyboard.on('press', () => {
      engine.goToScene('main');
    });
    this.input.pointers.on('down', () => {
      engine.goToScene('main');
    });
  }
}
