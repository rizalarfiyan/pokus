import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

const Theme = () => {
  const isLight = false

  return (
    <Button
      size="icon"
      variant="secondary"
      type="button"
      onClick={e => {
        e.preventDefault()
      }}>
      {isLight ? <Moon /> : <Sun />}
    </Button>
  )
}

export default Theme
