interface ISettings {
  pomodoroDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number

  showDesktopNotifications: boolean
  showNewTabNotifications: boolean
  notificationSound: string | null
}

const DEFAULT_SETTINGS: ISettings = {
  pomodoroDuration: 1 * 5 * 1000, // 5 seconds
  shortBreakDuration: 2 * 5 * 1000, // 10 seconds
  longBreakDuration: 3 * 5 * 1000, // 15 seconds
  longBreakInterval: 4,

  showDesktopNotifications: true,
  showNewTabNotifications: true,
  notificationSound: '/sounds/notification-1.ogg',
}

class Settings {
  private current: ISettings = { ...DEFAULT_SETTINGS }

  public async load(): Promise<ISettings> {
    return new Promise(resolve => {
      chrome.storage.sync.get('settings', data => {
        if (data.settings) {
          this.current = { ...DEFAULT_SETTINGS, ...data.settings }
        } else {
          this.save(this.current)
        }
        resolve(this.current)
      })
    })
  }

  public async save(newSettings: ISettings): Promise<void> {
    this.current = newSettings
    return new Promise(resolve => {
      chrome.storage.sync.set({ settings: newSettings }, () => {
        resolve()
      })
    })
  }

  public get(): ISettings {
    return this.current
  }
}

export type { ISettings }
export default Settings
