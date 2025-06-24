import type { LongBreakInterval, State, NotificationShow, Preset, Session, TimePreset } from '@/types/pomodoro'

type Actions = {
  changePreset: (preset: Preset) => void
  changeCustomPreset: (time: TimePreset) => void
  changeLongBreakInterval: (interval: LongBreakInterval) => void
  toggleShowNotification: (session: Session, show: NotificationShow) => void
  changeAudioNotification: (session: Session, audio: string | null) => void
}

type StateAction = State & Actions

export type { Actions, State, StateAction }
