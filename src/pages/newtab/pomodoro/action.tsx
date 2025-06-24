import FormatMilliseconds from './format-millisecond'
import { RadioGroupItem } from '@/components/ui/radio-group'

interface ActionProps {
  name: string
  value: string
  duration?: number
}

const Action = ({ name, value, duration = 0 }: ActionProps) => {
  const id = `pomodoro-${value}`
  return (
    <label
      htmlFor={id}
      className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-background has-data-[state=checked]:text-primary border-accent/60 has-focus-visible:border-ring has-focus-visible:ring-ring/50 bg-background/20 relative flex w-36 cursor-pointer flex-col items-center justify-center rounded-lg border-3 px-3 py-6 text-xs font-bold backdrop-blur-sm outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-80">
      <RadioGroupItem value={value} id={id} className="sr-only" />
      <FormatMilliseconds duration={duration} />
      <span className="text-sm font-bold">{name}</span>
    </label>
  )
}

export default Action
