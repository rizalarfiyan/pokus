import usePomodoroSetting from './store'
import { Switch } from '@/components/ui/switch'
import useDebounce from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { NotificationShow, Session } from './types'

interface SessionSwitchProps {
  session: Session
  show: NotificationShow
}

const SessionSwitch = ({ session, show }: SessionSwitchProps) => {
  const { value, toggleShowNotification } = usePomodoroSetting(
    useShallow(state => ({
      value: state.notification[session][show],
      toggleShowNotification: state.toggleShowNotification,
    })),
  )

  const [isActive, setIsActive] = useState(value)
  const debounce = useDebounce(isActive, 500)

  useEffect(() => {
    if (value === isActive) return
    toggleShowNotification(session, show)
  }, [debounce, session, show, toggleShowNotification])

  return <Switch checked={isActive} onCheckedChange={setIsActive} className="cursor-pointer" />
}

export default SessionSwitch
