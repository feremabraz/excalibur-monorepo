# Excalibur.js 2D Videogame Monorepo

This repository is a modern, workspace-driven monorepo for building 2D games using Excalibur.js.

It's fully typed and features a robust asset pipeline.

It includes a dedicated CLI that leverages Pixel Lab's API, making 2D asset creation accessible for developers without Pixel Art skills. You can even run the CLI to replace assets while in dev mode, so iteration it's really fast!

## Structure

- **game/** — Game project (TypeScript, Vite, Excalibur).
- **cli/** — CLI for generating pixel art assets via the Pixel Lab API.
- **shared/** — Shared utilities and types for all packages.
- **docs/** — Comprehensive technical and asset documentation.

## Requirements

- pnpm
- Node.js 18+

## Getting Started

1. **Install dependencies:**
   ```fish
   pnpm install
   ```
2. **Run the game (dev mode):**
   ```fish
   pnpm start:game
   ```
3. **Use the CLI:**
   ```fish
   pnpm start:cli -- --type character --desc "blue hero" --out ./output.png --token $PIXELLAB_TOKEN
   ```

## Workspace Commands

- **Format all code:**
  ```fish
  pnpm format
  ```
- **Lint all code:**
  ```fish
  pnpm lint
  ```
- **Type-check all packages:**
  ```fish
  pnpm typecheck
  ```

## Documentation

See the `docs/` directory for:

- Asset technical specifications
- Pixel Lab API usage
- Game architecture and extension guides
