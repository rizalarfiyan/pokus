import Alarms from './alarms'
import Badge from './badge'
import { Blocker } from './blocker'
import HistoryDB from './db/history'
import DesktopNotifier from './notifiers/desktop'
import NewTabNotifier from './notifiers/new-tab'
import SoundNotifier from './notifiers/sound'
import Settings from './settings'
import Timer from './timer'
import { SessionType, TimerState } from '@/constants/pomodoro'
import type { ICompletedSessionInfo, ITimer } from './timer'

const TEMP_WHITELIST_KEY = 'tempWhitelist'
const BLOCKED_URL_MAP_KEY = 'blockedUrlMap'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IChromeRequest = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IChromeSendResponse = (response?: any) => void

class BackgroundService {
  private settings: Settings
  private alarms: Alarms
  private desktopNotifier: DesktopNotifier
  private soundNotifier: SoundNotifier
  private newTabNotifier: NewTabNotifier
  private historyDB: HistoryDB
  private badge: Badge
  private timer: Timer | null = null
  private readonly TIMER_NOTIFICATION_ID = 'pomodoro-timer-notification'
  private lastCompletedSessionType: SessionType | null = null

  private blocker: Blocker
  private isBlockingActive: boolean = false

  constructor() {
    this.settings = new Settings()
    this.alarms = new Alarms()
    this.desktopNotifier = new DesktopNotifier()
    this.soundNotifier = new SoundNotifier()
    this.newTabNotifier = new NewTabNotifier()
    this.historyDB = new HistoryDB()
    this.badge = new Badge()
    this.blocker = new Blocker()
    this.isBlockingActive = false

    this.initialize()
  }

  private async initialize(): Promise<void> {
    const initialSettings = await this.settings.load()
    this.timer = new Timer(initialSettings)

    await this.blocker.disable()

    this.setupTimerHooks()
    this.setupListeners()
  }

  private setupTimerHooks(): void {
    if (!this.timer) return

    // update every second
    this.timer.onUpdate = async (timerState: ITimer) => {
      this.updateBadge(timerState)
      this.updateAlarm(timerState)
      this.sendMessageToUI('timerUpdate', timerState)
      this.triggerBlocking(timerState)
    }

    this.timer.onPause = sessionInfo => {
      this.historyDB.addSession({
        start_date: sessionInfo.startDate,
        end_date: sessionInfo.endDate,
        type: sessionInfo.type,
        has_valid_cycle: false,
      })
    }

    this.timer.onComplete = (sessionInfo: ICompletedSessionInfo) => {
      const currentSettings = this.settings.getPomodoro()
      const message = this.getCompletionMessage(sessionInfo.type)

      const notificationSettings = currentSettings.notification[sessionInfo.type]
      this.lastCompletedSessionType = sessionInfo.type

      if (notificationSettings.desktop) {
        this.desktopNotifier.show(this.TIMER_NOTIFICATION_ID, 'Pomodoro Timer', message, [{ title: 'Open Pokus' }])
      }

      if (notificationSettings.newTab) {
        this.newTabNotifier.show()
      }

      if (notificationSettings.audio) {
        this.soundNotifier.play(notificationSettings.audio)
      }

      this.saveCompletedSessionToHistory(sessionInfo)
    }
  }

  private saveCompletedSessionToHistory(sessionInfo: ICompletedSessionInfo): void {
    const isValidCycle = !sessionInfo.hasBeenResumed
    this.historyDB.addSession({
      start_date: sessionInfo.startDate,
      end_date: sessionInfo.endDate,
      type: sessionInfo.type,
      has_valid_cycle: isValidCycle,
    })
  }

  private setupListeners(): void {
    chrome.webNavigation.onBeforeNavigate.addListener(details => {
      if (details.frameId !== 0) return
      const url = new URL(details.url)
      const domain = url.hostname.replace(/^www\./, '')
      // TODO: add indexdb analytics user activity

      this.handleBlocking(domain, details)
    })

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (!this.timer) return true

      if (request.action === 'getOriginalUrl') {
        this.getOriginalUrl(sender, sendResponse)
        return true
      }

      if (request.action === 'addTempWhitelist') {
        this.addTempWhitelist(request, sendResponse)
        return true
      }

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
      if (notificationId === this.TIMER_NOTIFICATION_ID && buttonIndex === 0) {
        this.newTabNotifier.show()
      }
    })

    chrome.notifications.onClosed.addListener((notificationId, byUser) => {
      if (notificationId === this.TIMER_NOTIFICATION_ID && byUser && this.lastCompletedSessionType) {
        const currentSettings = this.settings.getPomodoro()
        const notificationSettings = currentSettings.notification[this.lastCompletedSessionType]
        if (notificationSettings.newTab) {
          this.newTabNotifier.show()
        }

        this.lastCompletedSessionType = null
      }
    })

    chrome.storage.sync.onChanged.addListener(changes => {
      if (changes.pomodoro) {
        const newSettings = changes.pomodoro.newValue
        this.settings.updatePomodoro(newSettings)
        this.timer?.updateSettings(newSettings)
      }

      if (changes.blocking) {
        // TODO: update blocking settings
        // const newSettings = changes.pomodoro.newValue
        // this.settings.updatePomodoro(newSettings)
        // this.timer?.updateSettings(newSettings)
      }
    })
  }

  private async getOriginalUrl(sender: chrome.runtime.MessageSender, sendResponse: IChromeSendResponse): Promise<void> {
    if (sender.tab?.id) {
      const data = await chrome.storage.session.get(BLOCKED_URL_MAP_KEY)
      const map = data[BLOCKED_URL_MAP_KEY] || {}
      const originalUrl = map[sender.tab.id]
      delete map[sender.tab.id]
      await chrome.storage.session.set({ [BLOCKED_URL_MAP_KEY]: map })
      sendResponse({ url: originalUrl })
      return
    }

    sendResponse({ url: null })
  }

  private async handleBlocking(domain: string, details: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
    if (!this.isBlockingActive) return

    // TODO: implement cache to best performance
    const currentSettings = this.settings.getBlocking()
    const sitesToBlock = Object.values(currentSettings.websites)
      .filter(w => w.isActive)
      .map(w => w.domain.replace(/^(https?:\/\/)?(www\.)?/, ''))

    if (sitesToBlock.includes(domain)) {
      const data = await chrome.storage.session.get(BLOCKED_URL_MAP_KEY)
      const map = data[BLOCKED_URL_MAP_KEY] || {}
      map[details.tabId] = details.url
      await chrome.storage.session.set({ [BLOCKED_URL_MAP_KEY]: map })
    }
  }

  private async addTempWhitelist(request: IChromeRequest, sendResponse: IChromeSendResponse): Promise<void> {
    const domain = request.domain
    if (!domain) return

    const data = await chrome.storage.session.get(TEMP_WHITELIST_KEY)
    const currentWhitelist = data[TEMP_WHITELIST_KEY] || []

    if (!currentWhitelist.includes(domain)) {
      currentWhitelist.push(domain)
    }

    await chrome.storage.session.set({ [TEMP_WHITELIST_KEY]: currentWhitelist })
    if (this.isBlockingActive) {
      const currentSettings = this.settings.getBlocking()
      await this.blocker.enable(currentSettings, currentWhitelist)
    }

    sendResponse({ success: true })
  }

  private async triggerBlocking(timerState: ITimer): Promise<void> {
    const shouldBeBlocking = timerState.state === TimerState.Running && timerState.type === SessionType.Focus
    if (shouldBeBlocking && !this.isBlockingActive) {
      const currentSettings = this.settings.getBlocking()
      const whitelist = (await chrome.storage.session.get(TEMP_WHITELIST_KEY))[TEMP_WHITELIST_KEY] || []
      await this.blocker.enable(currentSettings, whitelist)
      this.isBlockingActive = true
      return
    }

    if (!shouldBeBlocking && this.isBlockingActive) {
      await this.blocker.disable()
      await chrome.storage.session.remove(TEMP_WHITELIST_KEY)
      await chrome.storage.session.remove(BLOCKED_URL_MAP_KEY)
      this.isBlockingActive = false
      return
    }
  }

  private updateAlarm(timerState: ITimer): void {
    this.alarms.clear(this.TIMER_NOTIFICATION_ID)
    if (timerState.state === TimerState.Running) {
      this.alarms.create(this.TIMER_NOTIFICATION_ID, timerState.remainingTime / 60)
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
    if (completedType === SessionType.Focus) {
      return `Pomodoro finished! Time for a ${nextSession === SessionType.Long ? 'long' : 'short'} break.`
    }

    return 'Break is over! Time to get back to work.'
  }
}

new BackgroundService()
