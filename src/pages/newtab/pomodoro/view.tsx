import Action from './action'
import Gauge from './gauge'
import { formatTime, remainingPercent } from './utils'
import { RadioGroup } from '@/components/ui/radio-group'
import { SessionType, TimerState } from '@/constants/pomodoro'
import { Pause, Play } from 'lucide-react'
import { memo, useCallback } from 'react'
import type { ITimer } from '@/pages/background/timer'

interface ViewProps {
  timer: ITimer
  sendCommand: (action: string, payload?: unknown) => void
}

const View = memo(({ timer, sendCommand }: ViewProps) => {
  const isRunning = timer.state === TimerState.Running

  const handleButtonClick = useCallback(() => {
    if (isRunning) {
      sendCommand('pauseTimer')
    } else {
      sendCommand('startTimer')
    }
  }, [isRunning, sendCommand])

  const handleSessionChange = useCallback(
    (type: SessionType) => {
      sendCommand('setSessionType', { type })
    },
    [sendCommand],
  )

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center">
      <RadioGroup
        className="relative z-1 mt-[5rem] mb-6 flex items-center gap-4"
        value={timer.type}
        onValueChange={handleSessionChange}
        disabled={isRunning}>
        <Action value={SessionType.Focus} name="Focus" />
        <Action value={SessionType.Short} name="Sort Break" />
        <Action value={SessionType.Long} name="Long Break" />
      </RadioGroup>
      <div className="text-[10rem] leading-none font-bold">{formatTime(timer.remainingTime)}</div>
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-background/20 border-accent/60 relative z-1 mt-14 cursor-pointer rounded-full border p-5 backdrop-blur-sm">
        {isRunning ? <Pause className="size-12" /> : <Play className="size-12" />}
      </button>
      <Gauge
        className="absolute flex"
        width={700}
        percent={remainingPercent(timer.duration, timer.remainingTime)}
        strokeWidth={16}
      />
    </div>
  )
})

export default View
