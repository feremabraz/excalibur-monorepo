import * as ex from "excalibur";

export class SplashScene extends ex.Scene {
  override onInitialize(engine: ex.Engine): void {
    const label = new ex.Label({
      text: "Zelda-ish Multiplayer",
      pos: ex.vec(engine.drawWidth / 2, engine.drawHeight / 2 - 20),
      font: new ex.Font({
        family: "sans-serif",
        size: 32,
        color: ex.Color.White,
        textAlign: ex.TextAlign.Center,
        baseAlign: ex.BaseAlign.Middle,
      }),
      anchor: ex.vec(0.5, 0.5),
    });
    this.add(label);

    const subLabel = new ex.Label({
      text: "Press any key to start",
      pos: ex.vec(engine.drawWidth / 2, engine.drawHeight / 2 + 20),
      font: new ex.Font({
        family: "sans-serif",
        size: 18,
        color: ex.Color.Gray,
        textAlign: ex.TextAlign.Center,
        baseAlign: ex.BaseAlign.Middle,
      }),
      anchor: ex.vec(0.5, 0.5),
    });
    this.add(subLabel);

    this.input.keyboard.on("press", () => {
      engine.goToScene("main");
    });
    this.input.pointers.on("down", () => {
      engine.goToScene("main");
    });
  }
}
