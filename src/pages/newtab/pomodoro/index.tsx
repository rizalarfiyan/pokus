import Gauge from './gauge'
import { Play } from 'lucide-react'

const lists = [
  {
    name: 'Pomodoro',
    value: 0,
  },
  {
    name: 'Break',
    value: 0,
  },
  {
    name: 'Long Break',
    value: 0,
  },
]

const Pomodoro = () => (
  <div className="relative flex flex-1 flex-col items-center justify-center">
    <div className="mt-[5rem] mb-6 flex items-center gap-4">
      {lists.map(item => (
        <div
          key={item.name}
          className="bg-background/20 border-accent/60 flex w-28 flex-col items-center justify-center rounded-md border p-3 backdrop-blur-sm">
          <div className="text-5xl leading-none font-bold tabular-nums">{item.value}</div>
          <span className="text-sm font-bold">{item.name}</span>
        </div>
      ))}
    </div>
    <div className="text-[10rem] leading-none font-bold">25:00</div>
    <button
      type="button"
      className="bg-background/20 border-accent/60 mt-14 cursor-pointer rounded-full border p-5 backdrop-blur-sm">
      <Play className="size-12" />
    </button>
    <Gauge className="absolute flex" width={700} percent={50} strokeWidth={16} />
  </div>
)

export default Pomodoro
