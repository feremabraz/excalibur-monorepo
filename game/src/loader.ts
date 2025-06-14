import * as ex from "excalibur";
import { allResources } from "./resources";
import { Colors, GameText } from "./styles";

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
    
    const gameTitle = "Zelda-ish Game";
    const loadingMessage = `Loading... ${Math.round(this.progress * 100)}%`;

    // Draw Game Title
    ctx.fillStyle = GameText.LoaderTitleFont.color.toString();
    ctx.textAlign = GameText.LoaderTitleFont.textAlign;
    ctx.font = `${GameText.LoaderTitleFont.size}px ${GameText.LoaderTitleFont.family}`;
    ctx.fillText(gameTitle, x, gameTitleY);

    // Draw Loading Message
    ctx.fillStyle = GameText.LoaderSubtitleFont.color.toString(); // Ensure color is applied
    ctx.font = `${GameText.LoaderSubtitleFont.size}px ${GameText.LoaderSubtitleFont.family}`;
    ctx.fillText(loadingMessage, x, loadingMessageY);
  }

  // Prevents the default Excalibur loader UI by providing an onUserAction that doesn't create the default button
  public async onUserAction(): Promise<void> {
    // This can be left empty or handle custom interaction if needed
    return Promise.resolve();
  }
}

export const loader = new CustomLoader();
