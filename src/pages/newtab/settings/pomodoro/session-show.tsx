import SessionSwitch from './session-switch'
import { Label } from '@/components/ui/label'
import type { NotificationShow, Session } from '@/types/pomodoro'

interface SessionShowProps {
  session: Session
  show: NotificationShow
  title: string
  description: string
}

const SessionShow = ({ session, show, title, description }: SessionShowProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="space-y-1">
      <Label className="font-bold">{title}</Label>
      <p className="text-muted-foreground text-sm leading-tight">{description}</p>
    </div>
    <div className="flex w-32 flex-shrink-0 items-center justify-end">
      <SessionSwitch session={session} show={show} />
    </div>
  </div>
)

export default SessionShow
