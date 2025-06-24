import { memo } from 'react'
import type { TimePreset } from '@/types/pomodoro'

interface StackedBarProps {
  value: TimePreset
}

const StackedBar = memo(({ value: { focus, short, long } }: StackedBarProps) => {
  const total = focus + short + long
  const focusPercentage = (focus / total) * 100
  const shortPercentage = (short / total) * 100
  const longPercentage = (long / total) * 100

  const segments = [
    { value: focus, percentage: focusPercentage, label: 'Focus', color: 'var(--chart-1)' },
    { value: short, percentage: shortPercentage, label: 'Short', color: 'var(--chart-2)' },
    { value: long, percentage: longPercentage, label: 'Long', color: 'var(--chart-3)' },
  ]

  return (
    <div className="w-full">
      <div className="flex h-6 w-full overflow-hidden rounded-full bg-slate-200">
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              width: `${segment.percentage}%`,
              background: segment.color,
            }}
            className="flex h-full items-center justify-center text-sm font-bold text-white">
            {segment.value}
          </div>
        ))}
      </div>
      <div className="text-muted-foreground mt-1 flex w-full text-xs sm:text-sm">
        {segments.map((segment, index) => (
          <div key={index} style={{ width: `${segment.percentage}%` }} className="px-1 text-center">
            {segment.label}
          </div>
        ))}
      </div>
    </div>
  )
})

export default StackedBar
