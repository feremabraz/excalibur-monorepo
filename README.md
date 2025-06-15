# Excalibur.js 2D Videogame Monorepo

This repository is workspace-driven monorepo for building 2D games using Excalibur.js.

It includes a dedicated CLI that leverages Pixel Lab's API, making 2D asset creation accessible for developers without Pixel Art skills. You can run the CLI to replace assets while in dev mode.

## Structure

- **game/** — Game project (Vite, Excalibur).
- **cli/** — CLI for generating pixel art assets.
- **shared/** — Shared utilities and types for all packages.

## Requirements

- pnpm
- Node.js 18+

## Getting Started

1. **Install dependencies:**
   ```fish
   pnpm install
   ```
2. **Run the game:**
   ```fish
   pnpm start:game # or pnpm dev
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
