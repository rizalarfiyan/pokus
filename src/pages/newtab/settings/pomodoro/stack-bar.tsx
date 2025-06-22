import { memo } from 'react'

interface StackedBarProps {
  focus: number
  sort: number
  long: number
}

const StackedBar = memo(({ focus, sort, long }: StackedBarProps) => {
  const total = focus + sort + long
  const focusPercentage = (focus / total) * 100
  const sortPercentage = (sort / total) * 100
  const longPercentage = (long / total) * 100

  const segments = [
    { value: focus, percentage: focusPercentage, label: 'Focus', color: 'var(--chart-1)' },
    { value: sort, percentage: sortPercentage, label: 'Sort', color: 'var(--chart-2)' },
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
