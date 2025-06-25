import StatisticHeatmap from './heatmap'
import { millisecondsHumanizer } from './utils'

const dummies = [
  { date: 1735779600, time_focus: 489369, time_nc_focus: 633352 },
  { date: 1736125200, time_focus: 479427, time_nc_focus: 251502 },
  { date: 1737603600, time_focus: 194437, time_nc_focus: 104521 },
  { date: 1738746000, time_focus: 383344, time_nc_focus: 569341 },
  { date: 1739523600, time_focus: 399589, time_nc_focus: 686884 },
  { date: 1740982800, time_focus: 502808, time_nc_focus: 227632 },
  { date: 1741587600, time_focus: 147571, time_nc_focus: 593881 },
  { date: 1742624400, time_focus: 494541, time_nc_focus: 122176 },
  { date: 1744544400, time_focus: 598810, time_nc_focus: 213380 },
  { date: 1745062800, time_focus: 56715, time_nc_focus: 247098 },
  { date: 1747194000, time_focus: 58950, time_nc_focus: 122709 },
  { date: 1747453200, time_focus: 579044, time_nc_focus: 671239 },
  { date: 1748230800, time_focus: 257778, time_nc_focus: 421696 },
  { date: 1749891600, time_focus: 268680, time_nc_focus: 676673 },
  { date: 1750698000, time_focus: 636362, time_nc_focus: 651610 },
  { date: 1750678000, time_focus: 50000, time_nc_focus: 50000 },
]

const Statistics = () => (
  <div className="mx-auto flex items-center space-y-2 py-5">
    <div className="bg-background text-foreground inline-flex flex-col gap-6 rounded-lg border p-6">
      <h2 className="text-foreground text-center text-lg font-bold">Statistic of The Year</h2>
      <StatisticHeatmap
        histories={dummies}
        getValue={val => val['time_focus'] + val['time_nc_focus']}
        totalCountLabel={count => `${millisecondsHumanizer(count)} history in {{year}}`}
      />
    </div>
  </div>
)

export default Statistics
