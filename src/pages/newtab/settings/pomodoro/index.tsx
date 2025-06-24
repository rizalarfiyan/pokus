import PomodoroSession from './pomodoro-session'
import Presets from './presets'

const Pomodoro = () => (
  <div className="space-y-5">
    <Presets />
    <PomodoroSession />
  </div>
)

export default Pomodoro
