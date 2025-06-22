import PresetCustomSlider from './preset-custom-slider'
import StackedBar from './stack-bar'
import usePomodoroSetting from './store'
import useDebounce from '@/hooks/use-debounce'
import { useCallback, useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { PomodoroTime } from './types'

const PresetCustom = ({ focus, sort, long }: PomodoroTime) => {
  const changeCustomPreset = usePomodoroSetting(useShallow(state => state.changeCustomPreset))
  const [values, setValues] = useState({
    focus,
    sort,
    long,
  })

  const debounce = useDebounce(values, 750)
  useEffect(() => {
    changeCustomPreset(debounce)
  }, [debounce, changeCustomPreset])

  const handleFocusChange = useCallback((val: number[]) => {
    setValues(prev => ({ ...prev, focus: val[0] }))
  }, [])

  const handleSortChange = useCallback((val: number[]) => {
    setValues(prev => ({ ...prev, sort: val[0] }))
  }, [])

  const handleLongChange = useCallback((val: number[]) => {
    setValues(prev => ({ ...prev, long: val[0] }))
  }, [])

  return (
    <>
      <StackedBar focus={values.focus} sort={values.sort} long={values.long} />
      <PresetCustomSlider value={values.focus} label="Focus" onChange={handleFocusChange} />
      <PresetCustomSlider value={values.sort} label="Sort" onChange={handleSortChange} />
      <PresetCustomSlider value={values.long} label="Long" onChange={handleLongChange} className="mb-2" />
    </>
  )
}

export default PresetCustom
