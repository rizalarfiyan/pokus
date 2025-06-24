import PresetCustomSlider from './preset-custom-slider'
import StackedBar from './stack-bar'
import usePomodoroSetting from './store'
import useDebounceCallback from '@/hooks/use-debounce-callback'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { TimePreset } from '@/types/pomodoro'

const PresetCustom = () => {
  const { changeCustomPreset, custom } = usePomodoroSetting(
    useShallow(state => ({
      changeCustomPreset: state.changeCustomPreset,
      custom: state.custom,
    })),
  )

  const handleUpdateStore = useCallback(
    (newValues: TimePreset) => {
      changeCustomPreset(newValues)
    },
    [changeCustomPreset],
  )

  const [values, setValues] = useDebounceCallback(custom, handleUpdateStore, 750)

  const handleFocusChange = useCallback((val: number[]) => {
    setValues(prev => ({ ...prev, focus: val[0] }))
  }, [])

  const handleShortChange = useCallback((val: number[]) => {
    setValues(prev => ({ ...prev, short: val[0] }))
  }, [])

  const handleLongChange = useCallback((val: number[]) => {
    setValues(prev => ({ ...prev, long: val[0] }))
  }, [])

  return (
    <>
      <StackedBar value={values} />
      <PresetCustomSlider value={values.focus} label="Focus" onChange={handleFocusChange} />
      <PresetCustomSlider value={values.short} label="Short" onChange={handleShortChange} />
      <PresetCustomSlider value={values.long} label="Long" onChange={handleLongChange} className="mb-2" />
    </>
  )
}

export default PresetCustom
