import {defineConfig} from 'tsup'; 

export default defineConfig({
  clean: true,
  outDir: 'dist',
  target: 'node18',
  format: ['cjs'],
  entry: ['./src/**/*.ts', '!./src/**/*.test.ts', './src/**/*.js'],
})