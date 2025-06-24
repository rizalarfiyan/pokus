import usePomodoroSetting from './store'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Volume2 } from 'lucide-react'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { ValueLabel } from '@/pages/newtab/types'
import type { Session } from '@/types/pomodoro'

const sounds: ValueLabel[] = [
  { value: '/sounds/notification-1.ogg', label: 'Notification 1' },
  { value: '/sounds/notification-2.ogg', label: 'Notification 2' },
  { value: '/sounds/notification-3.ogg', label: 'Notification 3' },
  { value: '/sounds/notification-4.ogg', label: 'Notification 4' },
  { value: '/sounds/notification-5.ogg', label: 'Notification 5' },
  { value: '/sounds/notification-6.ogg', label: 'Notification 6' },
]

const playAudio = (sound: string) => {
  const audio = new Audio(sound)
  audio.play().catch(error => {
    console.error('Error playing audio:', error)
  })
}

interface PlayAudioProps {
  session: Session
}

const PlayAudio = ({ session }: PlayAudioProps) => {
  const { audio, changeAudioNotification } = usePomodoroSetting(
    useShallow(state => ({
      audio: state.notification[session].audio,
      changeAudioNotification: state.changeAudioNotification,
    })),
  )

  const onChangeAudio = useCallback(
    (value: string) => {
      if (value === 'none') {
        changeAudioNotification(session, null)
        return
      }

      changeAudioNotification(session, value)
      playAudio(value)
    },
    [changeAudioNotification, session],
  )

  const onPlayAudio = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!audio) return
      playAudio(audio)
    },
    [audio],
  )

  return (
    <div className="flex items-center gap-2">
      <Select value={String(audio ?? 'none')} onValueChange={onChangeAudio}>
        <SelectTrigger className="w-40 cursor-pointer">
          <SelectValue placeholder="Long break interval" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">None</SelectItem>
            {sounds.map(({ value, label }) => (
              <SelectItem key={value} value={String(value)} className="cursor-pointer">
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
        <Button variant="outline" size="icon" onClick={onPlayAudio}>
          <Volume2 />
        </Button>
      </Select>
    </div>
  )
}

export default PlayAudio
