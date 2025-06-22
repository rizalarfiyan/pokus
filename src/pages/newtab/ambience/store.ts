import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AmbienceActive, StateAction } from './type'

const useAmbience = create<StateAction>()(
  persist(
    set => ({
      active: {} as AmbienceActive,
      reset: () => set({ active: {} as AmbienceActive }),
      toggle: ambience =>
        set(state => {
          if (state.active[ambience.type]) {
            const newAmbience = { ...state.active }
            delete newAmbience[ambience.type]
            return { active: newAmbience }
          }

          return {
            active: { ...state.active, [ambience.type]: ambience },
          }
        }),
      changeVariant: (type, variant) =>
        set(state => {
          const current = state.active[type]
          if (!current) return state
          return {
            active: {
              ...state.active,
              [type]: {
                ...current,
                variant: variant,
              },
            },
          }
        }),
      changeVolume: (type, volume) =>
        set(state => {
          const current = state.active[type]
          if (!current) return state
          return {
            active: {
              ...state.active,
              [type]: {
                ...current,
                volume: volume,
              },
            },
          }
        }),
    }),
    {
      name: 'ambience',
    },
  ),
)

export default useAmbience
