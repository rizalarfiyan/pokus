import useTimer from './use-timer'
import View from './view'
import { LoaderCircle } from 'lucide-react'

const Pomodoro = () => {
  const [timer, sendCommand] = useTimer()

  if (!timer) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="bg-background/40 border-accent/60 text-primary flex flex-col items-center space-y-2 rounded-lg p-10 backdrop-blur-sm">
          <LoaderCircle className="size-12 animate-spin" />
          <span className="font-bold">Loading...</span>
        </div>
      </div>
    )
  }

  return <View timer={timer} sendCommand={sendCommand} />
}

export default Pomodoro
