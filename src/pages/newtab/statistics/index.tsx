import StatisticHeatmap from './heatmap'
import Monthly from './monthly'
import { millisecondsHumanizer } from './utils'
import { history } from '@/pages/newtab/database'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'

const YearlyStatistic = () => {
  const query = useLiveQuery(() => {
    const startOfYear = dayjs().startOf('year').unix()
    const endOfYear = dayjs().endOf('year').unix()
    return history.dailyStats.where('date').between(startOfYear, endOfYear, true, true).toArray()
  })

  return (
    <div className="bg-background text-foreground inline-flex flex-col gap-6 rounded-lg border p-6">
      <h2 className="text-foreground text-center text-lg font-bold">Statistic of The Year</h2>
      <StatisticHeatmap
        histories={query ?? []}
        getValue={val => val['time_focus'] + val['time_nc_focus']}
        totalCountLabel={count => `${millisecondsHumanizer(count)} history in {{year}}`}
      />
    </div>
  )
}

const MonthlyStatistic = () => {
  const query = useLiveQuery(() => {
    const startOfMonth = dayjs().startOf('month').unix()
    const endOfMonth = dayjs().endOf('month').unix()
    return history.dailyStats.where('date').between(startOfMonth, endOfMonth, true, true).toArray()
  })

  return <Monthly history={query ?? []} />
}

const Statistics = () => (
  <div className="flex flex-col items-center gap-4 space-y-2 py-5">
    <YearlyStatistic />
    <MonthlyStatistic />
  </div>
)

export default Statistics
