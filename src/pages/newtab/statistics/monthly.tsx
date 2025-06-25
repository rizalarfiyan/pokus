import { millisecondsHumanizer } from './utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from '@/components/ui/chart'
import dayjs, { unix } from 'dayjs'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type StatisticItem from './types'
import type { ChartConfig } from '@/components/ui/chart'
import type React from 'react'
import type { TooltipProps } from 'recharts'

interface MonthlyProps {
  history: StatisticItem[]
  month?: dayjs.Dayjs
}

const chartConfig = {
  focus: {
    label: 'Focus',
    color: 'var(--chart-1)',
  },
  short: {
    label: 'Short Break',
    color: 'var(--chart-2)',
  },
  long: {
    label: 'Long Break',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

const CustomTooltipContent = ({
  active,
  payload,
  label,
  config,
}: TooltipProps<number, string> & { config?: ChartConfig }) => {
  if (active && payload && payload.length && config) {
    const dayLabel = `Day ${label}`

    return (
      <div className="bg-background min-w-[12rem] rounded-lg border p-2 text-sm shadow-sm">
        <div className="mb-2 font-bold">{dayLabel}</div>
        <div className="grid gap-1.5">
          {payload
            .slice()
            .reverse()
            .map(item => {
              const itemConfig = config[item.dataKey as keyof typeof config]
              return (
                <div key={item.dataKey} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span>{itemConfig.label}</span>
                  </div>
                  <span className="ml-4 font-bold">{millisecondsHumanizer(item.value || 0)}</span>
                </div>
              )
            })}
        </div>
      </div>
    )
  }
  return null
}

const Monthly: React.FC<MonthlyProps> = ({ history, month: targetMonth = dayjs() }) => {
  const chartData = useMemo(() => {
    const monthStart = targetMonth.startOf('month')
    const monthEnd = targetMonth.endOf('month')

    const filteredData = history.filter(item => {
      const itemDate = unix(item.date)
      return itemDate.isAfter(monthStart.subtract(1, 'day')) && itemDate.isBefore(monthEnd.add(1, 'day'))
    })

    const aggregatedByDay = new Map<string, { focus: number; short: number; long: number }>()

    for (const item of filteredData) {
      const day = unix(item.date).format('D')
      const currentData = aggregatedByDay.get(day) || { focus: 0, short: 0, long: 0 }

      currentData.focus += (item.time_focus || 0) + (item.time_nc_focus || 0)
      currentData.short += (item.time_short || 0) + (item.time_nc_short || 0)
      currentData.long += (item.time_long || 0) + (item.time_nc_long || 0)

      aggregatedByDay.set(day, currentData)
    }

    const daysInMonth = targetMonth.daysInMonth()
    const result = []

    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = String(i)
      const data = aggregatedByDay.get(dayStr) || { focus: 0, short: 0, long: 0 }
      result.push({ day: dayStr, ...data })
    }

    return result
  }, [history, targetMonth])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Activity</CardTitle>
        <CardDescription>{targetMonth.format('MMMM YYYY')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => {
                const dayNumber = parseInt(value)
                return targetMonth.date(dayNumber).format('DD MMM YY')
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={value => millisecondsHumanizer(value)}
            />
            <ChartTooltip cursor={false} content={<CustomTooltipContent config={chartConfig} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="long" stackId="a" fill="var(--color-long)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="short" stackId="a" fill="var(--color-short)" />
            <Bar dataKey="focus" stackId="a" fill="var(--color-focus)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Monthly
