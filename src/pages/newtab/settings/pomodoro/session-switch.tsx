import usePomodoroSetting from './store'
import { Switch } from '@/components/ui/switch'
import useDebounceCallback from '@/hooks/use-debounce-callback'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { NotificationShow, Session } from '@/types/pomodoro'

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

  const handleUpdate = useCallback(() => {
    toggleShowNotification(session, show)
  }, [session, show, toggleShowNotification])

  const [isActive, setIsActive] = useDebounceCallback(value, handleUpdate, 500)

  return <Switch checked={isActive} onCheckedChange={setIsActive} className="cursor-pointer" />
}

export default SessionSwitch
