type Preset = 'sort-burst' | 'classic' | 'extended' | 'deep-work' | 'custom'

interface PomodoroTime {
  focus: number
  sort: number
  long: number
}

interface TimePreset extends PomodoroTime {
  value: Preset
  name: string
  description: string
}

interface State {
  presets: TimePreset[]
  preset: Preset
}

type Actions = {
  changePreset: (preset: Preset) => void
  changeCustomPreset: (time: PomodoroTime) => void
}

type StateAction = State & Actions

export type { Preset, TimePreset, State, Actions, StateAction, PomodoroTime }
