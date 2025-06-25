import { notification, timePreset } from '@/constants/pomodoro'
import createDeepMerge from '@fastify/deepmerge'
import type { BlockingSettings } from '@/types/blocking'
import type { PomodoroSettings } from '@/types/pomodoro'

const DEFAULT_POMODORO: PomodoroSettings = {
  ...timePreset['classic'],
  preset: 'classic',
  custom: timePreset['classic'],
  longBreakInterval: 4,
  notification,
}

const DEFAULT_BLOCKING: BlockingSettings = {
  theme: 'default',
  websites: {
    '1': {
      id: '1',
      name: 'Facebook',
      domain: 'facebook.com',
      isActive: true,
    },
    '2': {
      id: '2',
      name: 'Instagram',
      domain: 'instagram.com',
      isActive: true,
    },
    '3': {
      id: '3',
      name: 'X (Twitter)',
      domain: 'x.com',
      isActive: true,
    },
    '4': {
      id: '4',
      name: 'TikTok',
      domain: 'tiktok.com',
      isActive: true,
    },
    '5': {
      id: '5',
      name: 'LinkedIn',
      domain: 'linkedin.com',
      isActive: false,
    },
    '6': {
      id: '6',
      name: 'YouTube',
      domain: 'youtube.com',
      isActive: true,
    },
    '7': {
      id: '7',
      name: 'Netflix',
      domain: 'netflix.com',
      isActive: true,
    },
    '8': {
      id: '8',
      name: 'Steam Store',
      domain: 'store.steampowered.com',
      isActive: true,
    },
    '9': {
      id: '9',
      name: 'Disney+ Hotstar',
      domain: 'hotstar.com',
      isActive: false,
    },
    '10': {
      id: '10',
      name: 'Detik.com',
      domain: 'detik.com',
      isActive: true,
    },
    '11': {
      id: '11',
      name: 'Kompas.com',
      domain: 'kompas.com',
      isActive: true,
    },
    '12': {
      id: '12',
      name: 'CNN Indonesia',
      domain: 'cnnindonesia.com',
      isActive: true,
    },
    '13': {
      id: '13',
      name: 'Tokopedia',
      domain: 'tokopedia.com',
      isActive: true,
    },
    '14': {
      id: '14',
      name: 'Shopee',
      domain: 'shopee.co.id',
      isActive: true,
    },
    '15': {
      id: '15',
      name: 'Lazada',
      domain: 'lazada.co.id',
      isActive: true,
    },
  },
  groups: {
    'social-media': {
      id: 'social-media',
      name: 'Social Media',
      websiteIds: ['1', '2', '3', '4', '5'],
    },
    'streaming-gaming': {
      id: 'streaming-gaming',
      name: 'Streaming & Gaming',
      websiteIds: ['6', '7', '8', '9'],
    },
    news: {
      id: 'news',
      name: 'News',
      websiteIds: ['10', '11', '12'],
    },
    shopping: {
      id: 'shopping',
      name: 'Shopping',
      websiteIds: ['13', '14', '15'],
    },
  },
  groupOrder: ['social-media', 'streaming-gaming', 'news', 'shopping'],
}

class Settings {
  private pomodoro: PomodoroSettings = { ...DEFAULT_POMODORO }
  private blocking: BlockingSettings = { ...DEFAULT_BLOCKING }

  public async load(): Promise<PomodoroSettings> {
    const deepMerge = createDeepMerge()

    return new Promise(resolve => {
      chrome.storage.sync.get(['pomodoro', 'blocking'], data => {
        if (data.pomodoro) {
          this.pomodoro = deepMerge(DEFAULT_POMODORO, data.pomodoro)
        } else {
          this.savePomodoro(this.pomodoro)
        }

        if (data.blocking) {
          this.blocking = deepMerge(DEFAULT_BLOCKING, data.blocking)
        } else {
          this.saveBlocking(this.blocking)
        }

        resolve(this.pomodoro)
      })
    })
  }

  public async savePomodoro(settings: PomodoroSettings): Promise<void> {
    this.pomodoro = settings
    return new Promise(resolve => {
      chrome.storage.sync.set({ pomodoro: settings }, () => {
        resolve()
      })
    })
  }

  public async saveBlocking(settings: BlockingSettings): Promise<void> {
    this.blocking = settings
    return new Promise(resolve => {
      chrome.storage.sync.set({ blocking: settings }, () => {
        resolve()
      })
    })
  }

  public getPomodoro(): PomodoroSettings {
    return this.pomodoro
  }

  public updatePomodoro(newSettings: PomodoroSettings): void {
    this.pomodoro = newSettings
  }

  public getBlocking(): BlockingSettings {
    return this.blocking
  }

  public updateBlocking(newSettings: BlockingSettings): void {
    this.blocking = newSettings
  }
}

export default Settings
