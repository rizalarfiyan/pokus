import usePomodoroSetting from './store'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { ValueLabel } from '@/pages/newtab/types'
import type { LongBreakInterval } from '@/types/pomodoro'

const longBreaks: ValueLabel<LongBreakInterval>[] = [
  { value: 0, label: 'Never' },
  { value: 2, label: 'Every 2nd break (alternative)' },
  { value: 3, label: 'Every 3rd break' },
  { value: 4, label: 'Every 4th break' },
  { value: 5, label: 'Every 5th break' },
  { value: 6, label: 'Every 6th break' },
  { value: 7, label: 'Every 7th break' },
  { value: 8, label: 'Every 8th break' },
  { value: 9, label: 'Every 9th break' },
  { value: 10, label: 'Every 10th break' },
]

const LongBreakInterval = () => {
  const { longBreakInterval, changeLongBreakInterval } = usePomodoroSetting(
    useShallow(state => ({
      longBreakInterval: state.longBreakInterval,
      changeLongBreakInterval: state.changeLongBreakInterval,
    })),
  )

  const onValueChange = useCallback(
    (value: string) => {
      const numValue = Number(value)
      if (isNaN(numValue)) return
      changeLongBreakInterval(numValue as LongBreakInterval)
    },
    [changeLongBreakInterval],
  )

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 space-y-1">
        <Label className="font-bold">Long Break Interval</Label>
        <p className="text-muted-foreground text-sm leading-tight">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </p>
      </div>
      <Select onValueChange={onValueChange} value={String(longBreakInterval)}>
        <SelectTrigger className="w-full max-w-40 cursor-pointer">
          <SelectValue placeholder="Long break interval" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {longBreaks.map(({ value, label }) => (
              <SelectItem key={value} value={String(value)} className="cursor-pointer">
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default LongBreakInterval
