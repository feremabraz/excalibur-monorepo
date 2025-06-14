import * as ex from "excalibur";
import { cn } from "@/lib/utils";

// Game-specific styling that works alongside Tailwind CSS
export const styles = {
	colors: {
		background: "#1a1a1a", // bg-slate-900 equivalent
		primary: "#ffffff", // text-white
		secondary: "#333333", // bg-slate-700 equivalent
		accent: "#4CAF50", // bg-green-500 equivalent
		gray: "#808080", // text-gray-500 equivalent
	},
	fonts: {
		main: {
			family: "Arial",
			sizes: {
				title: 32, // text-3xl equivalent
				subtitle: 24, // text-xl equivalent
				body: 18, // text-lg equivalent
				small: 16, // text-base equivalent
			},
		},
	},
	progressBar: {
		width: 300,
		height: 20,
		borderWidth: 2,
	},
	decorativeBar: {
		width: 300,
		height: 4,
	},
	spacing: {
		titleOffset: -50,
		subtitleOffset: 20,
		decorativeOffset: 60,
		progressTextOffset: 30,
	},
	// Tailwind CSS classes for UI components
	tailwind: {
		gameContainer:
			"w-full h-screen flex justify-center items-center bg-slate-900",
		loadingText: "text-white text-2xl font-bold",
		progressBar: "w-96 h-5 bg-slate-700 rounded-full overflow-hidden",
		progressFill: "h-full bg-green-500 transition-all duration-300",
		splashTitle: "text-white text-4xl font-bold mb-4",
		splashSubtitle: "text-gray-400 text-lg",
		button:
			"px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors",
	},
} as const;

// Excalibur Color objects for convenience
export const exColors = {
	background: ex.Color.fromHex(styles.colors.background),
	primary: ex.Color.fromHex(styles.colors.primary),
	secondary: ex.Color.fromHex(styles.colors.secondary),
	accent: ex.Color.fromHex(styles.colors.accent),
	gray: ex.Color.Gray,
} as const;
