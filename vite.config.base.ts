import devManifest from './manifest.dev.json'
import manifest from './manifest.json'
import pkg from './package.json'
import { devIcons } from './vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import type { BuildOptions } from 'vite'

const isDev = process.env.__DEV__ === 'true'

export const baseManifest = {
  ...manifest,
  version: pkg.version,
  ...(isDev ? devManifest : ({} as ManifestV3Export)),
  default_locale: 'en',
} as ManifestV3Export

export const baseBuildOptions: BuildOptions = {
  sourcemap: isDev,
  emptyOutDir: !isDev,
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), devIcons(isDev)],
  esbuild: {
    legalComments: 'none',
  },
  publicDir: resolve(__dirname, 'public'),
})
