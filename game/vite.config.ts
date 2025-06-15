import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3006,
  },
  resolve: {
    alias: {
      '@actors': resolve(__dirname, 'src/actors'),
      '@classes': resolve(__dirname, 'src/classes'),
      '@maps': resolve(__dirname, 'src/maps'),
      '@constants': resolve(__dirname, 'src/constants.ts'),
      '@resources': resolve(__dirname, 'src/resources.ts'),
      '@character-animations': resolve(
        __dirname,
        'src/character-animations.ts',
      ),
      '@helpers': resolve(__dirname, 'src/helpers.ts'),
    },
  },
});
