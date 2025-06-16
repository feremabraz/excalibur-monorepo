import { allResources } from '@resources';
import { Colors } from '@styles/colors';
import { GameText } from '@styles/text';
import * as ex from 'excalibur';

class CustomLoader extends ex.Loader {
  constructor() {
    super();
    this.suppressPlayButton = true;
    for (const res in allResources) {
      this.addResource(allResources[res]);
    }
  }

  public onDraw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Colors.BACKGROUND_DARK.toString();
    ctx.fillRect(0, 0, this.engine.drawWidth, this.engine.drawHeight);

    const x = this.engine.halfDrawWidth;
    const gameTitleY = this.engine.halfDrawHeight - 30;
    const loadingMessageY = this.engine.halfDrawHeight + 10;

    const gameTitle = 'Zelda-ish Game';
    const loadingMessage = `Loading... ${Math.round(this.progress * 100)}%`;

    ctx.fillStyle = GameText.LoaderTitleFont.color.toString();
    ctx.textAlign = GameText.LoaderTitleFont.textAlign;
    ctx.font = `${GameText.LoaderTitleFont.size}px ${GameText.LoaderTitleFont.family}`;
    ctx.fillText(gameTitle, x, gameTitleY);

    ctx.fillStyle = GameText.LoaderSubtitleFont.color.toString();
    ctx.font = `${GameText.LoaderSubtitleFont.size}px ${GameText.LoaderSubtitleFont.family}`;
    ctx.fillText(loadingMessage, x, loadingMessageY);
  }

  // Prevents the default Excalibur loader UI by providing an onUserAction that doesn't create the default button
  public async onUserAction(): Promise<void> {
    return Promise.resolve();
  }
}

export const loader = new CustomLoader();
