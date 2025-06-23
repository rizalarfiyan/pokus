import type { ISettings } from './settings'

enum TimerState {
  Running = 'running',
  Paused = 'paused',
  Stopped = 'stopped',
}

enum SessionType {
  Pomodoro = 'pomodoro',
  ShortBreak = 'shortBreak',
  LongBreak = 'longBreak',
}

interface ITimer {
  state: TimerState
  type: SessionType
  startTime: number | null
  duration: number
  remainingTime: number
}

interface ICompletedSessionInfo {
  startDate: number
  endDate: number
  type: SessionType
  hasBeenResumed: boolean
}

class Timer {
  public state: ITimer
  private settings: ISettings
  private pomodorosCompleted: number = 0
  private intervalId: NodeJS.Timeout | null = null

  private hasBeenResumed: boolean = false

  public onUpdate: ((timer: ITimer) => void) | null = null
  public onPause: ((sessionInfo: Omit<ICompletedSessionInfo, 'hasBeenResumed'>) => void) | null = null
  public onComplete: ((sessionInfo: ICompletedSessionInfo) => void) | null = null

  constructor(settings: ISettings) {
    this.settings = settings
    this.state = this.createInitialState(SessionType.Pomodoro)
  }

  private createInitialState(type: SessionType): ITimer {
    const duration = this.getDurationForSession(type)
    this.hasBeenResumed = false
    return {
      state: TimerState.Stopped,
      type: type,
      startTime: null,
      duration: duration,
      remainingTime: duration,
    }
  }

  public start(): void {
    if (this.state.state === TimerState.Paused) {
      this.hasBeenResumed = true
    }

    if (this.state.state === TimerState.Running) return
    this.state.state = TimerState.Running
    this.state.duration = this.state.remainingTime
    this.state.startTime = Date.now()
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = setInterval(() => this.tick(), 1000)
    this.notifyUpdate()
  }

  public pause(): void {
    if (this.state.state !== TimerState.Running || !this.state.startTime) return

    const endTimeMs = Date.now()
    if (this.onPause) {
      this.onPause({
        startDate: this.state.startTime,
        endDate: endTimeMs,
        type: this.state.type,
      })
    }

    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null
    this.state.state = TimerState.Paused

    this.state.remainingTime = this.state.duration - (endTimeMs - this.state.startTime)
    this.state.startTime = null
    this.notifyUpdate()
  }

  public restart(): void {
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null

    const currentType = this.state.type
    this.state = this.createInitialState(currentType)
    this.start()
  }

  public setSessionType(newType: SessionType): void {
    if (this.state.state === TimerState.Running) {
      console.warn('Cannot change session type while timer is running.')
      return
    }

    this.hasBeenResumed = false

    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null

    this.state = this.createInitialState(newType)
    this.notifyUpdate()
  }

  public skip(): void {
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null

    this.handleSessionCompletion()
  }

  public resetCycle(): void {
    if (this.intervalId) clearInterval(this.intervalId)
    this.hasBeenResumed = false
    this.intervalId = null
    this.pomodorosCompleted = 0
    this.state = this.createInitialState(SessionType.Pomodoro)
    this.notifyUpdate()
  }

  private handleSessionCompletion(): void {
    if (!this.state.startTime) {
      console.error('Cannot complete session: start time is missing.')
      return
    }

    const endDateMs = this.state.startTime + this.state.duration
    const completedSessionInfo: ICompletedSessionInfo = {
      startDate: this.state.startTime,
      endDate: endDateMs,
      type: this.state.type,
      hasBeenResumed: this.hasBeenResumed,
    }

    if (this.onComplete) {
      this.onComplete(completedSessionInfo)
    }

    const completedType = this.state.type

    if (completedType === SessionType.Pomodoro) {
      this.pomodorosCompleted++
      const nextType =
        this.pomodorosCompleted % this.settings.longBreakInterval === 0 ? SessionType.LongBreak : SessionType.ShortBreak
      this.state = this.createInitialState(nextType)
    } else {
      this.state = this.createInitialState(SessionType.Pomodoro)
    }

    this.notifyUpdate()
  }

  public updateSettings(newSettings: ISettings): void {
    this.settings = newSettings
    this.resetCycle()
  }

  private tick(): void {
    if (!this.state.startTime) return
    this.state.remainingTime = this.state.duration - (Date.now() - this.state.startTime)

    if (this.state.remainingTime <= 0) {
      this.state.remainingTime = 0
      if (this.intervalId) clearInterval(this.intervalId)
      this.intervalId = null
      this.handleSessionCompletion()
    }
    this.notifyUpdate()
  }

  private getDurationForSession(sessionType: SessionType): number {
    switch (sessionType) {
      case SessionType.Pomodoro:
        return this.settings.pomodoroDuration
      case SessionType.ShortBreak:
        return this.settings.shortBreakDuration
      case SessionType.LongBreak:
        return this.settings.longBreakDuration
      default:
        return this.settings.pomodoroDuration
    }
  }

  private notifyUpdate(): void {
    if (this.onUpdate) {
      this.onUpdate(this.state)
    }
  }
}

export { SessionType, TimerState }
export type { ICompletedSessionInfo, ITimer }
export default Timer
