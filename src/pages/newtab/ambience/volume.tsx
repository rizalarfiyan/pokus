import useAmbience from './store'
import { Slider } from '@/components/ui/slider'
import useDebounce from '@/hooks/use-debounce'
import { useCallback, useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { AmbienceState, ListAmbience } from './type'

interface VolumeProps {
  ambience: ListAmbience
  active?: AmbienceState
}

const Volume = ({ ambience, active }: VolumeProps) => {
  const changeVolume = useAmbience(useShallow(state => state.changeVolume))
  const [volume, setVolume] = useState(active?.volume ?? 50)
  const debounce = useDebounce(volume, 750)

  useEffect(() => {
    changeVolume(ambience.type, debounce)
  }, [debounce, ambience])

  const onChange = useCallback((val: number[]) => {
    setVolume(val[0])
  }, [])

  return (
    <Slider
      className="mx-auto-pointer relative mt-4 w-full max-w-40 cursor-pointer"
      defaultValue={[volume]}
      max={100}
      min={1}
      step={1}
      onValueChange={onChange}
    />
  )
}

export default Volume
