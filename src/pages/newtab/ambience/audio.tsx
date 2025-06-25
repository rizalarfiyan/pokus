import { useEffect, useRef, useState } from 'react'
import type { AmbienceState } from './type'

interface AudioProps {
  active?: AmbienceState
}

const Audio = ({ active }: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const elem = audioRef.current
    if (!elem) return

    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => setIsLoading(false)

    elem.addEventListener('canplaythrough', handleCanPlay)
    elem.addEventListener('error', handleError)

    if (active && active.type) {
      const url = `https://is3.cloudhost.id/pokus/${active.type}/${active.variant}.ogg`

      if (elem.src !== url) {
        setIsLoading(true)
        elem.src = url
      }
      elem.loop = true

      const playPromise = elem.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsLoading(false)
        })
      }
    } else {
      elem.pause()
      elem.src = ''
      setIsLoading(false)
    }

    return () => {
      elem.removeEventListener('canplaythrough', handleCanPlay)
      elem.removeEventListener('error', handleError)
    }
  }, [active])

  useEffect(() => {
    const elem = audioRef.current
    if (elem && active) {
      elem.volume = active.volume / 100
    }
  }, [active?.volume])

  return (
    <>
      <audio ref={audioRef} className="hidden">
        <track kind="captions" />
      </audio>
      {isLoading && (
        <div className="absolute bottom-4 flex items-center justify-center gap-1">
          <div className="bg-background size-2 animate-bounce rounded-full" style={{ animationDelay: '0ms' }}></div>
          <div className="bg-background size-2 animate-bounce rounded-full" style={{ animationDelay: '200ms' }}></div>
          <div className="bg-background size-2 animate-bounce rounded-full" style={{ animationDelay: '400ms' }}></div>
        </div>
      )}
    </>
  )
}

export default Audio
