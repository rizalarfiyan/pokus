import { StorageEnum } from '../constants'
import { createStorage } from '../core'
import type { BaseStorageType } from '../types'

interface ThemeStateType {
  theme: 'light' | 'dark'
  isLight: boolean
}

type ThemeStorageType = BaseStorageType<ThemeStateType> & {
  toggle: () => Promise<void>
}

const storage = createStorage<ThemeStateType>(
  'theme',
  {
    theme: 'light',
    isLight: true,
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
)

const themeStorage: ThemeStorageType = {
  ...storage,
  toggle: async () => {
    await storage.set(currentState => {
      const newTheme = currentState.theme === 'light' ? 'dark' : 'light'

      return {
        theme: newTheme,
        isLight: newTheme === 'light',
      }
    })
  },
}

export default themeStorage
export type { ThemeStateType, ThemeStorageType }
