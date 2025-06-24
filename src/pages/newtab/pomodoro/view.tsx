import Gauge from './gauge'
import Session from './session'
import { formatTime, remainingPercent } from './utils'
import { TimerState } from '@/constants/pomodoro'
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

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center">
      <Session sendCommand={sendCommand} type={timer.type} isRunning={isRunning} />
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
