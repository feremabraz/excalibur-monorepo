#!/usr/bin/env node

/**
 * Zelda-ish PixelLab CLI
 * Generate pixel art assets for the game using the Pixel Lab API
 * Usage: zeldaish-pixellab --type character --desc "blue hero" --out ./output.png --token $PIXELLAB_TOKEN
 */

import { argv, env, exit } from "node:process";
import { writeFile } from "node:fs/promises";
import https from "node:https";
import type { IncomingMessage } from "node:http";

function parseArgs() {
	const args: Record<string, string> = {};
	for (let i = 2; i < argv.length; i++) {
		if (argv[i].startsWith("--")) {
			const key = argv[i].slice(2);
			const value =
				argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
			args[key] = value;
		}
	}
	return args;
}

const assetPresets: Record<string, { width: number; height: number }> = {
	character: { width: 320, height: 320 },
	monster: { width: 64, height: 64 },
	sword: { width: 96, height: 32 },
	arrow: { width: 16, height: 64 },
	explosion: { width: 224, height: 32 },
	map: { width: 304, height: 352 },
};

async function main() {
	const args = parseArgs();
	const type = args.type;
	const desc = args.desc;
	const out = args.out;
	const token = args.token || env.PIXELLAB_TOKEN;
	if (!type || !desc || !out || !token) {
		console.error(
			"Usage: zeldaish-pixellab --type <asset> --desc <description> --out <file> --token <api_token>",
		);
		exit(1);
	}
	const preset = assetPresets[type];
	if (!preset) {
		console.error(`Unknown asset type: ${type}`);
		exit(1);
	}
	const body = JSON.stringify({
		description: desc,
		image_size: { width: preset.width, height: preset.height },
		no_background: true,
		view: "high top-down",
		isometric: false,
	});
	const options = {
		hostname: "api.pixellab.ai",
		path: "/v1/generate-image-pixflux",
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(body),
		},
	};
	const req = https.request(options, (res: IncomingMessage) => {
		let data = "";
		res.on("data", (chunk: Buffer) => {
			data += chunk.toString();
		});
		res.on("end", async () => {
			try {
				const json = JSON.parse(data);
				if (!json.image || !json.image.base64) {
					console.error("No image returned from API.");
					exit(1);
				}
				const buf = Buffer.from(json.image.base64, "base64");
				await writeFile(out, buf);
				console.log(`Saved: ${out}`);
			} catch (e) {
				console.error("Error parsing response:", e);
				exit(1);
			}
		});
	});
	req.on("error", (e: Error) => {
		console.error("Request error:", e);
		exit(1);
	});
	req.write(body);
	req.end();
}

main();
