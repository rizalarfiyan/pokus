import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StateAction, TimePreset } from './types'

const presets: TimePreset[] = [
  {
    value: 'sort-burst',
    name: 'Sort Burst',
    description: 'Short bursts of focused work with minimal breaks.',
    focus: 15,
    sort: 3,
    long: 10,
  },
  {
    value: 'classic',
    name: 'Classic',
    description: 'The traditional Pomodoro technique with balanced intervals.',
    focus: 25,
    sort: 5,
    long: 15,
  },
  {
    value: 'extended',
    name: 'Extended',
    description: 'Longer focus sessions for deep concentration.',
    focus: 45,
    sort: 10,
    long: 30,
  },
  {
    value: 'deep-work',
    name: 'Deep Work',
    description: 'Maximized focus for intense and prolonged work sessions.',
    focus: 60,
    sort: 15,
    long: 45,
  },
  {
    value: 'custom',
    name: 'Custom',
    description: 'Personalized intervals tailored to your preferences.',
    focus: 25,
    sort: 5,
    long: 15,
  },
]

const usePomodoroSetting = create<StateAction>()(
  persist(
    set => ({
      presets,
      preset: 'classic',
      changePreset: preset => set({ preset }),
      changeCustomPreset: ({ focus, sort, long }) =>
        set(state => {
          const customIndex = state.presets.findIndex(p => p.value === 'custom')
          if (customIndex === -1) return state
          const newPresets = [...state.presets]
          newPresets[customIndex] = { ...newPresets[customIndex], focus, sort, long }
          return { presets: newPresets }
        }),
    }),
    {
      name: 'pomodoro-setting',
    },
  ),
)

export default usePomodoroSetting
