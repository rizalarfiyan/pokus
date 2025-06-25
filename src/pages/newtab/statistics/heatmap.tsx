import dayjs, { unix } from 'dayjs'
import { useMemo } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import type StatisticItem from './types'
import type React from 'react'
import type { Activity } from 'react-activity-calendar'

interface StatisticHeatmapProps {
  histories: StatisticItem[]
  year?: number
  isLoading?: boolean
  getValue: (item: StatisticItem) => number
  totalCountLabel?: (total: number) => string
}

const DATE_FORMAT = 'YYYY-MM-DD'

const StatisticHeatmap: React.FC<StatisticHeatmapProps> = ({
  histories,
  year = new Date().getFullYear(),
  isLoading,
  getValue,
  totalCountLabel = () => '{{count}} history in {{year}}',
}) => {
  const data = useMemo(() => {
    const keyMap = new Map<string, number>()
    let total = 0

    const years = dayjs().year(year)
    keyMap.set(years.startOf('year').format(DATE_FORMAT), 0)

    for (const item of histories) {
      const dateStr = unix(item.date).format(DATE_FORMAT)
      const value = getValue(item)
      total += value
      keyMap.set(dateStr, (keyMap.get(dateStr) || 0) + value)
    }

    const endYear = years.endOf('year').format(DATE_FORMAT)
    keyMap.set(endYear, keyMap.get(endYear) || 0)

    const maxCount = Math.max(0, ...Array.from(keyMap.values()))
    return {
      lists: Array.from(keyMap.entries()).map(([date, count]) => {
        let level = 0
        if (count > 0 && maxCount > 0) {
          level = Math.ceil((count / maxCount) * 4)
        }
        return {
          date,
          count,
          level: Math.min(4, Math.max(0, level)) as Activity['level'],
        }
      }),
      total,
    }
  }, [histories, getValue])

  const baseColor = 'var(--primary)'
  const emptyColor = 'var(--secondary)'

  return (
    <ActivityCalendar
      data={data.lists}
      theme={{
        light: [
          emptyColor,
          `color-mix(in srgb, ${baseColor} 25%, transparent)`,
          `color-mix(in srgb, ${baseColor} 50%, transparent)`,
          `color-mix(in srgb, ${baseColor} 75%, transparent)`,
          baseColor,
        ],
        dark: [
          emptyColor,
          `color-mix(in srgb, ${baseColor} 25%, transparent)`,
          `color-mix(in srgb, ${baseColor} 50%, transparent)`,
          `color-mix(in srgb, ${baseColor} 75%, transparent)`,
          baseColor,
        ],
      }}
      showWeekdayLabels
      blockSize={14}
      blockMargin={4}
      loading={isLoading}
      labels={{
        totalCount: totalCountLabel(data.total),
      }}
    />
  )
}

export default StatisticHeatmap
