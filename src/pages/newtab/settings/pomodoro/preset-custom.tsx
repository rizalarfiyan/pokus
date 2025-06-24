import PresetCustomSlider from './preset-custom-slider'
import StackedBar from './stack-bar'
import usePomodoroSetting from './store'
import useDebounce from '@/hooks/use-debounce'
import { useCallback, useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { TimePreset } from '@/types/pomodoro'

const PresetCustom = () => {
  const { changeCustomPreset, custom } = usePomodoroSetting(
    useShallow(state => ({
      changeCustomPreset: state.changeCustomPreset,
      custom: state.custom,
    })),
  )

  const [values, setValues] = useState<TimePreset>({
    focus: custom.focus,
    short: custom.short,
    long: custom.long,
  })

  useEffect(() => {
    // todo: change with deep equal
    if (values.focus !== custom.focus || values.short !== custom.short || values.long !== custom.long) {
      setValues({
        focus: custom.focus,
        short: custom.short,
        long: custom.long,
      })
    }
  }, [custom])

  const debounce = useDebounce(values, 750)
  useEffect(() => {
    changeCustomPreset(debounce)
  }, [debounce, changeCustomPreset])

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
