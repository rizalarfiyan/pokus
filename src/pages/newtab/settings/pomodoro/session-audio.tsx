import PlayAudio from './play-audio'
import { Label } from '@/components/ui/label'
import type { Session } from '@/types/pomodoro'

interface SessionAudioProps {
  session: Session
  title: string
  description: string
}

const SessionAudio = ({ session, title, description }: SessionAudioProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="space-y-1">
      <Label className="font-bold">{title}</Label>
      <p className="text-muted-foreground text-sm leading-tight">{description}</p>
    </div>
    <PlayAudio session={session} />
  </div>
)

export default SessionAudio
