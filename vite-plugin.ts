import fs from 'fs'
import { resolve } from 'path'
import type { Plugin } from 'vite'

export const devIcons = (isDev: boolean): Plugin | null => {
  if (isDev) return null

  return {
    name: 'dev-icons',
    resolveId(source: string) {
      return source === 'virtual-module' ? source : null
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderStart(outputOptions: any) {
      const outDir = outputOptions.dir
      const icons = [16, 32, 48, 128]
      for (const icon of icons) {
        const name = `dev-icon-${icon}.png`
        fs.rm(resolve(outDir, name), () => console.log(`Deleted ${name} from prod build`))
      }
    },
  }
}
