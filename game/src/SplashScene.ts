import * as ex from "excalibur";
import { styles, exColors } from "./styles";

export class SplashScene extends ex.Scene {
	override onInitialize(engine: ex.Engine): void {
		// Set dark background to match loader
		this.backgroundColor = exColors.background;

		// Main title - "Zelda-ish Adventure"
		const titleLabel = new ex.Label({
			text: "Zelda-ish Adventure",
			pos: ex.vec(
				engine.drawWidth / 2,
				engine.drawHeight / 2 + styles.spacing.titleOffset,
			),
			font: new ex.Font({
				family: `"Press Start 2P", ${styles.fonts.main.family}`,
				size: styles.fonts.main.sizes.title,
				color: exColors.accent,
				textAlign: ex.TextAlign.Center,
				baseAlign: ex.BaseAlign.Middle,
			}),
			anchor: ex.vec(0.5, 0.5),
		});
		this.add(titleLabel);

		// Subtitle instruction
		const instructionLabel = new ex.Label({
			text: "Press any key to start",
			pos: ex.vec(
				engine.drawWidth / 2,
				engine.drawHeight / 2 + styles.spacing.subtitleOffset,
			),
			font: new ex.Font({
				family: `"Press Start 2P", ${styles.fonts.main.family}`,
				size: styles.fonts.main.sizes.body,
				color: exColors.primary,
				textAlign: ex.TextAlign.Center,
				baseAlign: ex.BaseAlign.Middle,
			}),
			anchor: ex.vec(0.5, 0.5),
		});
		this.add(instructionLabel);

		// Optional: Add a decorative border/frame like the progress bar
		const decorativeBar = new ex.Rectangle({
			width: styles.decorativeBar.width,
			height: styles.decorativeBar.height,
			color: exColors.accent, // Same green as progress bar
		});
		const decorativeActor = new ex.Actor({
			pos: ex.vec(
				engine.drawWidth / 2,
				engine.drawHeight / 2 + styles.spacing.decorativeOffset,
			),
			anchor: ex.vec(0.5, 0.5),
		});
		decorativeActor.graphics.use(decorativeBar);
		this.add(decorativeActor);

		// Input handlers remain the same
		this.input.keyboard.on("press", () => {
			engine.goToScene("main");
		});
		this.input.pointers.on("down", () => {
			engine.goToScene("main");
		});
	}
}
