import { notification, timePreset } from '@/constants/pomodoro'
import createDeepMerge from '@fastify/deepmerge'
import type { PomodoroSettings } from '@/types/pomodoro'

const DEFAULT_POMODORO: PomodoroSettings = {
  ...timePreset['classic'],
  preset: 'classic',
  custom: timePreset['classic'],
  longBreakInterval: 4,
  notification,
}

class Settings {
  private pomodoro: PomodoroSettings = { ...DEFAULT_POMODORO }

  public async load(): Promise<PomodoroSettings> {
    const deepMerge = createDeepMerge()

    return new Promise(resolve => {
      chrome.storage.sync.get('pomodoro', data => {
        if (data.pomodoro) {
          this.pomodoro = deepMerge(DEFAULT_POMODORO, data.pomodoro)
        } else {
          this.save(this.pomodoro)
        }
        resolve(this.pomodoro)
      })
    })
  }

  public async save(newSettings: PomodoroSettings): Promise<void> {
    this.pomodoro = newSettings
    return new Promise(resolve => {
      chrome.storage.sync.set({ pomodoro: newSettings }, () => {
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
}

export default Settings
