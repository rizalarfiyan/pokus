import Alarms from './alarms'
import Badge from './badge'
import HistoryDB from './db/history'
import DesktopNotifier from './notifiers/desktop'
import NewTabNotifier from './notifiers/new-tab'
import SoundNotifier from './notifiers/sound'
import Settings from './settings'
import Timer, { TimerState, SessionType } from './timer'
import type { ITimer, ICompletedSessionInfo } from './timer'

class BackgroundService {
  private settings: Settings
  private alarms: Alarms
  private desktopNotifier: DesktopNotifier
  private soundNotifier: SoundNotifier
  private newTabNotifier: NewTabNotifier
  private historyDB: HistoryDB
  private badge: Badge
  private timer: Timer | null = null
  private readonly ALARM_NAME = 'pomodoroTimerComplete'

  constructor() {
    this.settings = new Settings()
    this.alarms = new Alarms()
    this.desktopNotifier = new DesktopNotifier()
    this.soundNotifier = new SoundNotifier()
    this.newTabNotifier = new NewTabNotifier()
    this.historyDB = new HistoryDB()
    this.badge = new Badge()

    this.initialize()
  }

  private async initialize(): Promise<void> {
    const initialSettings = await this.settings.load()
    this.timer = new Timer(initialSettings)

    this.setupTimerHooks()
    this.setupListeners()
  }

  private setupTimerHooks(): void {
    if (!this.timer) return

    // update every second
    this.timer.onUpdate = (timerState: ITimer) => {
      this.updateBadge(timerState)
      this.updateAlarm(timerState)
      this.sendMessageToUI('timerUpdate', timerState)
    }

    this.timer.onPause = sessionInfo => {
      const sessionTypeForDB = this.mapSessionTypeForDB(sessionInfo.type)
      if (!sessionTypeForDB) return

      this.historyDB.addSession({
        start_date: sessionInfo.startDate,
        end_date: sessionInfo.endDate,
        type: sessionTypeForDB,
        has_valid_cycle: false,
      })
    }

    this.timer.onComplete = (sessionInfo: ICompletedSessionInfo) => {
      const currentSettings = this.settings.get()
      const message = this.getCompletionMessage(sessionInfo.type)

      if (currentSettings.showDesktopNotifications) {
        this.desktopNotifier.show(this.ALARM_NAME, 'Pomodoro Timer', message, [{ title: 'Open Pokus' }])
      }

      if (currentSettings.showNewTabNotifications) {
        this.newTabNotifier.show()
      }

      if (currentSettings.notificationSound) {
        this.soundNotifier.play(currentSettings.notificationSound)
      }

      const sessionTypeForDB = this.mapSessionTypeForDB(sessionInfo.type)
      if (!sessionTypeForDB) return

      const isValidCycle = !sessionInfo.hasBeenResumed

      this.historyDB.addSession({
        start_date: sessionInfo.startDate,
        end_date: sessionInfo.endDate,
        type: sessionTypeForDB,
        has_valid_cycle: isValidCycle,
      })
    }
  }

  private mapSessionTypeForDB(type: SessionType): 'pomodoro' | 'sort' | 'long' | null {
    switch (type) {
      case SessionType.Pomodoro:
        return 'pomodoro'
      case SessionType.ShortBreak:
        return 'sort'
      case SessionType.LongBreak:
        return 'long'
      default:
        return null
    }
  }

  private setupListeners(): void {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (!this.timer) return true

      // TODO: update the request action later
      if (request.action === 'setSettings' && this.timer.state.state === TimerState.Running) {
        console.warn('Attempted to change settings while timer is running. Ignored.')
        sendResponse(this.timer.state)
        return true
      }

      switch (request.action) {
        case 'startTimer':
          this.timer.start()
          break
        case 'pauseTimer':
          this.timer.pause()
          break
        case 'skipTimer':
          this.timer.skip()
          break
        case 'resetTimer':
          this.timer.resetCycle()
          break
        case 'setSessionType':
          if (request.type) {
            this.timer.setSessionType(request.type)
          }
          break
        case 'getTimer':
          break
      }

      sendResponse(this.timer.state)
      return true
    })

    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      if (notificationId === this.ALARM_NAME && buttonIndex === 0) {
        this.newTabNotifier.show()
      }
    })

    chrome.notifications.onClosed.addListener((notificationId, byUser) => {
      if (notificationId === this.ALARM_NAME && byUser) {
        const currentSettings = this.settings.get()

        if (currentSettings.showNewTabNotifications) {
          this.newTabNotifier.show()
        }
      }
    })

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync' && changes.settings) {
        this.timer?.updateSettings(changes.settings.newValue)
      }
    })
  }

  private updateAlarm(timerState: ITimer): void {
    this.alarms.clear(this.ALARM_NAME)
    if (timerState.state === TimerState.Running) {
      this.alarms.create(this.ALARM_NAME, timerState.remainingTime / 60)
    }
  }

  private updateBadge(timerState: ITimer): void {
    if (timerState.state === TimerState.Running) {
      const minutes = Math.ceil(timerState.remainingTime / (60 * 1000)) // change to milliseconds to minutes
      this.badge.setText(`${minutes}`)
      this.badge.setColor('#d9534f')
    } else {
      this.badge.clear()
    }
  }

  private sendMessageToUI(action: string, data: ITimer): void {
    chrome.runtime.sendMessage({ action, data })
  }

  private getCompletionMessage(completedType: SessionType): string {
    const nextSession = this.timer?.state.type
    if (completedType === SessionType.Pomodoro) {
      return `Pomodoro finished! Time for a ${nextSession === SessionType.LongBreak ? 'long' : 'short'} break.`
    }

    return 'Break is over! Time to get back to work.'
  }
}

new BackgroundService()
