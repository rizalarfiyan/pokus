import baseConfig, { baseManifest, baseBuildOptions } from './vite.config.base'
import { crx } from '@crxjs/vite-plugin'
import { mergeConfig, defineConfig } from 'vite'
import { resolve } from 'path'
import type { ManifestV3Export } from '@crxjs/vite-plugin'

const outDir = resolve(__dirname, 'dist_firefox')

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      crx({
        manifest: {
          ...baseManifest,
          background: {
            scripts: ['src/pages/background/index.ts'],
          },
        } as ManifestV3Export,
        browser: 'firefox',
        contentScripts: {
          injectCss: true,
        },
      }),
    ],
    build: {
      ...baseBuildOptions,
      outDir,
    },
    publicDir: resolve(__dirname, 'public'),
  }),
)
