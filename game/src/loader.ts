import * as ex from "excalibur";
import { Images, Sounds } from "./resources";
import { styles } from "./styles";

class CustomLoader extends ex.Loader {
	public override onDraw(ctx: CanvasRenderingContext2D) {
		// Get canvas dimensions
		const canvasWidth = ctx.canvas.width;
		const canvasHeight = ctx.canvas.height;

		// Clear the canvas with a dark background
		ctx.fillStyle = styles.colors.background;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// Draw retro-style border frame
		ctx.strokeStyle = styles.colors.accent;
		ctx.lineWidth = 4;
		ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

		// Draw inner border
		ctx.strokeStyle = styles.colors.secondary;
		ctx.lineWidth = 2;
		ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);

		// Draw loading text with retro font style
		ctx.fillStyle = styles.colors.accent;
		ctx.font = `${styles.fonts.main.sizes.subtitle}px "Press Start 2P", ${styles.fonts.main.family}`;
		ctx.textAlign = "center";
		ctx.fillText(
			"LOADING",
			canvasWidth / 2,
			canvasHeight / 2 + styles.spacing.titleOffset,
		);

		// Draw subtitle
		ctx.fillStyle = styles.colors.primary;
		ctx.font = `${styles.fonts.main.sizes.small}px "Press Start 2P", ${styles.fonts.main.family}`;
		ctx.fillText(
			"Zelda-ish Adventure",
			canvasWidth / 2,
			canvasHeight / 2 + styles.spacing.titleOffset + 40,
		);

		// Draw progress bar background with retro styling
		const barWidth = styles.progressBar.width;
		const barHeight = styles.progressBar.height;
		const barX = (canvasWidth - barWidth) / 2;
		const barY = canvasHeight / 2;

		// Progress bar outer border
		ctx.fillStyle = styles.colors.primary;
		ctx.fillRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8);

		// Progress bar background
		ctx.fillStyle = styles.colors.secondary;
		ctx.fillRect(barX, barY, barWidth, barHeight);

		// Draw progress bar fill with chunky pixel style
		const progress = this.progress; // 0 to 1
		const fillWidth = Math.floor(barWidth * progress);
		ctx.fillStyle = styles.colors.accent;
		ctx.fillRect(barX, barY, fillWidth, barHeight);

		// Add retro scan lines effect
		ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
		for (let i = 0; i < canvasHeight; i += 4) {
			ctx.fillRect(0, i, canvasWidth, 2);
		}

		// Draw percentage text with glow effect
		ctx.fillStyle = styles.colors.primary;
		ctx.font = `${styles.fonts.main.sizes.small}px "Press Start 2P", ${styles.fonts.main.family}`;
		const percentText = `${Math.round(progress * 100)}%`;
		ctx.fillText(
			percentText,
			canvasWidth / 2,
			barY + barHeight + styles.spacing.progressTextOffset,
		);

		// Add subtle glow to percentage text
		ctx.shadowColor = styles.colors.accent;
		ctx.shadowBlur = 10;
		ctx.fillStyle = styles.colors.accent;
		ctx.fillText(
			percentText,
			canvasWidth / 2,
			barY + barHeight + styles.spacing.progressTextOffset,
		);
		ctx.shadowBlur = 0;
	}
}

// Create the empty loader and add all resources
const loader = new CustomLoader();

const allResources = { ...Images, ...Sounds };
for (const resource of Object.values(allResources)) {
	loader.addResource(resource);
}

export { loader };
