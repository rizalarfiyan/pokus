type Preset = 'sort-burst' | 'classic' | 'extended' | 'deep-work' | 'custom'

type LongBreakInterval = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type Session = 'focus' | 'long' | 'short'

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

type Actions = {
  changePreset: (preset: Preset) => void
  changeCustomPreset: (time: TimePreset) => void
  changeLongBreakInterval: (interval: LongBreakInterval) => void
  toggleShowNotification: (session: Session, show: NotificationShow) => void
  changeAudioNotification: (session: Session, audio: string | null) => void
}

type StateAction = State & Actions

export type {
  Session,
  Preset,
  LongBreakInterval,
  TimePreset,
  PresetItem,
  State,
  Actions,
  StateAction,
  NotificationItem,
  NotificationShow,
  Notification,
}
