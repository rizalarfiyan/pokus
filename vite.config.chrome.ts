import baseConfig, { baseManifest, baseBuildOptions } from './vite.config.base'
import { crx } from '@crxjs/vite-plugin'
import { mergeConfig, defineConfig } from 'vite'
import { resolve } from 'path'
import type { ManifestV3Export } from '@crxjs/vite-plugin'

const outDir = resolve(__dirname, 'dist_chrome')

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      crx({
        manifest: {
          ...baseManifest,
          background: {
            service_worker: 'src/pages/background/index.ts',
            type: 'module',
          },
        } as ManifestV3Export,
        browser: 'chrome',
        contentScripts: {
          injectCss: true,
        },
      }),
    ],
    build: {
      ...baseBuildOptions,
      outDir,
    },
  }),
)
