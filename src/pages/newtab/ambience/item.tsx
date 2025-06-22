import Icon from './icon'
import useAmbience from './store'
import Variant from './variant'
import Volume from './volume'
import { cn } from '@/lib/utils'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { AmbienceState, ListAmbience } from './type'

interface ItemProps {
  ambience: ListAmbience
}

const Item = ({ ambience }: ItemProps) => {
  const { active, toggle } = useAmbience(
    useShallow(state => ({
      active: state.active[ambience.type],
      toggle: state.toggle,
    })),
  )

  const onClick = useCallback(() => {
    toggle({
      type: ambience.type,
      variant: ambience.variant[0],
      volume: 50,
    } as AmbienceState)
  }, [toggle, ambience])

  return (
    <div className="border-foreground/70 bg-muted/30 flex min-h-56 w-full max-w-[16rem] flex-col items-center justify-center rounded-lg p-4 backdrop-blur-sm">
      <button type="button" className="cursor-pointer" onClick={onClick}>
        <Icon
          icon={ambience.type}
          className={cn(
            'size-16 opacity-50 transition-all duration-300 hover:scale-110 hover:opacity-80',
            active && 'size-10 opacity-100',
          )}
        />
      </button>
      <div
        className={cn(
          'mx-auto flex max-h-0 w-full flex-col items-center gap-4 overflow-hidden transition-all duration-300',
          active && 'max-h-screen',
        )}>
        <Volume ambience={ambience} active={active} />
        <Variant ambience={ambience} active={active} />
      </div>
    </div>
  )
}

export default Item
