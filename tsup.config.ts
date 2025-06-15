import { defineConfig } from 'tsup';

export default defineConfig([
  // API pública
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
  },
  // CLI
  {
    entry: {
      'cli/index': 'src/cli/bin.ts',
      'cli/plopfile': 'src/cli/plopfile.ts',
    },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
  },
]);