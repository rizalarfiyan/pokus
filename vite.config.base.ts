import { defineConfig, type BuildOptions } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from "@tailwindcss/vite"
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import { resolve } from 'path';
import pkg from './package.json'
import manifest from './manifest.json'
import devManifest from './manifest.dev.json'
import { devIcons } from './vite-plugin'

const isDev = process.env.__DEV__ === 'true'

export const baseManifest = {
  ...manifest,
  version: pkg.version,
  ...(isDev ? devManifest : {} as ManifestV3Export),
  default_locale : 'en'
} as ManifestV3Export

export const baseBuildOptions: BuildOptions = {
  sourcemap: isDev,
  emptyOutDir: !isDev
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    devIcons(isDev),
  ],
	esbuild: {
		legalComments: 'none',
	},
  publicDir: resolve(__dirname, 'public'),
})
