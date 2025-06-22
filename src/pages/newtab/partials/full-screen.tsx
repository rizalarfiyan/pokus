import { Button } from '@/components/ui/button'
import { Expand } from 'lucide-react'

const FullScreen = () => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error)
    } else {
      document.documentElement.requestFullscreen().catch(console.error)
    }
  }

  return (
    <Button size="icon" variant="secondary" type="button" onClick={onClick}>
      <Expand />
    </Button>
  )
}

export default FullScreen
