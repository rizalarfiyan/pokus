import useAmbience from './store'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { AmbienceState, AmbienceVariantType, ListAmbience } from './type'

interface VariantProps {
  ambience: ListAmbience
  active?: AmbienceState
}

const Variant = ({ ambience, active }: VariantProps) => {
  const changeVariant = useAmbience(useShallow(state => state.changeVariant))

  const onChange = useCallback(
    (value: string) => {
      changeVariant(ambience.type, value as AmbienceVariantType)
    },
    [changeVariant, ambience.type],
  )

  return (
    <RadioGroup
      className="flex flex-wrap items-center justify-center gap-1"
      defaultValue={active?.variant ?? ambience.variant[0]}
      onValueChange={onChange}>
      {ambience.variant.map(variant => {
        const id = `${ambience.type}-${variant}`
        return (
          <label
            htmlFor={id}
            className="border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 bg-background text-primary relative cursor-pointer rounded-md border-2 px-1.5 py-0.5 text-xs font-bold backdrop-blur-sm outline-none has-focus-visible:ring-[3px]">
            <RadioGroupItem value={variant} id={id} className="sr-only" />
            {variant}
          </label>
        )
      })}
    </RadioGroup>
  )
}

export default Variant
