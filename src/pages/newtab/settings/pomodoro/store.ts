import { notification, timePreset } from './constant'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StateAction } from './types'

const usePomodoroSetting = create<StateAction>()(
  persist(
    set => ({
      ...timePreset['classic'],
      preset: 'classic',
      custom: timePreset['classic'],
      longBreakInterval: 4,
      notification,
      changePreset: preset =>
        set(state => {
          if (preset === 'custom') {
            return { ...state.custom, preset }
          }
          return { preset, ...timePreset[preset] }
        }),
      changeCustomPreset: custom =>
        set(state => {
          if (state.preset === 'custom') {
            return { preset: 'custom', ...custom, custom }
          }

          return { custom }
        }),
      changeLongBreakInterval: interval =>
        set(() => ({
          longBreakInterval: interval,
        })),
      toggleShowNotification: (session, show) =>
        set(state => ({
          notification: {
            ...state.notification,
            [session]: {
              ...state.notification[session],
              [show]: !state.notification[session][show],
            },
          },
        })),
      changeAudioNotification: (session, audio) =>
        set(state => ({
          notification: {
            ...state.notification,
            [session]: {
              ...state.notification[session],
              audio,
            },
          },
        })),
    }),
    {
      name: 'pomodoro-setting',
    },
  ),
)

export default usePomodoroSetting
