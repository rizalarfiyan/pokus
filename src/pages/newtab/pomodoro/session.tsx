import Action from './action'
import { RadioGroup } from '@/components/ui/radio-group'
import { SessionType } from '@/constants/pomodoro'
import { history } from '@/pages/newtab/database'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { memo, useCallback, useMemo } from 'react'

interface SessionProps {
  type: SessionType
  isRunning?: boolean
  sendCommand: (action: string, payload?: unknown) => void
}

const Session = memo(({ type, isRunning = false, sendCommand }: SessionProps) => {
  const handleSessionChange = useCallback(
    (type: SessionType) => {
      sendCommand('setSessionType', { type })
    },
    [sendCommand],
  )

  const query = useLiveQuery(() => history.dailyStats.where('date').equals(dayjs().startOf('day').unix()).first())

  const dailyStats = useMemo(
    () => ({
      focus: (query?.time_focus || 0) + (query?.time_nc_focus || 0),
      short: (query?.time_short || 0) + (query?.time_nc_short || 0),
      long: (query?.time_long || 0) + (query?.time_nc_long || 0),
    }),
    [query],
  )

  return (
    <RadioGroup
      className="relative z-1 mt-[5rem] mb-6 flex items-center gap-4"
      value={type}
      onValueChange={handleSessionChange}
      disabled={isRunning}>
      <Action duration={dailyStats.focus} value={SessionType.Focus} name="Focus" />
      <Action duration={dailyStats.short} value={SessionType.Short} name="Short Break" />
      <Action duration={dailyStats.long} value={SessionType.Long} name="Long Break" />
    </RadioGroup>
  )
})

export default Session
