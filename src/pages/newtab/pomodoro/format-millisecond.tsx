import { millisecondsHumanizer } from './utils'
import { memo } from 'react'

interface FormatMillisecondsProps {
  duration: number
}

const FormatMilliseconds = memo(({ duration }: FormatMillisecondsProps) => {
  const ms = millisecondsHumanizer(duration)

  return (
    <div className="flex items-end justify-center gap-1 font-bold">
      {ms.map(({ value, unit }) => (
        <div key={unit}>
          <span className="text-4xl tabular-nums">{value}</span>
          <span className="text-lg">{unit}</span>
        </div>
      ))}
    </div>
  )
})

export default FormatMilliseconds
