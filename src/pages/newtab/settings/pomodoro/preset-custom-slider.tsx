import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { memo } from 'react'

interface PresetCustomSliderProps {
  className?: string
  label: string
  value: number
  onChange: (value: number[]) => void
}

const PresetCustomSlider = memo(({ className, label, value, onChange }: PresetCustomSliderProps) => (
  <div className={cn('flex flex-col items-start gap-2', className)}>
    <div className="flex w-full items-center justify-between text-sm font-bold">
      <div>{value} min</div>
      <div>{label}</div>
    </div>
    <Slider
      className="relative w-full cursor-pointer"
      defaultValue={[value]}
      value={[value]}
      max={100}
      min={1}
      step={1}
      onValueChange={onChange}
    />
  </div>
))

export default PresetCustomSlider
