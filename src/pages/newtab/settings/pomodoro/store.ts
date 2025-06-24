import { notification, timePreset } from '@/constants/pomodoro'
import chromeStorage from '@/storage/zustand'
import { create } from 'zustand'
import type { StateAction } from './types'

const usePomodoroSetting = create<StateAction>()(
  chromeStorage(
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
      name: 'pomodoro',
      storageType: 'sync',
    },
  ),
)

export default usePomodoroSetting
