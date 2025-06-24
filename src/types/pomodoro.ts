import type { SessionType } from '@/constants/pomodoro'

type Preset = 'sort-burst' | 'classic' | 'extended' | 'deep-work' | 'custom'

type LongBreakInterval = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type Session = `${SessionType}`

type TimePreset = Record<Session, number>

interface PresetItem {
  value: Preset
  name: string
  description: string
}

type NotificationShow = 'desktop' | 'newTab'

interface NotificationItem extends Record<NotificationShow, boolean> {
  audio: string | null
}

type Notification = Record<Session, NotificationItem>

interface State extends TimePreset {
  preset: Preset
  custom: TimePreset
  longBreakInterval: LongBreakInterval
  notification: Notification
}

type PomodoroSettings = State

export type {
  LongBreakInterval,
  Notification,
  NotificationShow,
  PomodoroSettings,
  Preset,
  PresetItem,
  Session,
  State,
  TimePreset,
}
