import useBlocking from './store'
import { Switch } from '@/components/ui/switch'
import useDebounce from '@/hooks/use-debounce'
import { memo, useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Id, WebsiteType } from './types'

interface WebsiteActiveToggleProps {
  websiteId: Id
  website: WebsiteType
}

const WebsiteActiveToggle = memo(({ websiteId, website }: WebsiteActiveToggleProps) => {
  const toggleWebsiteActive = useBlocking(useShallow(state => state.toggleWebsiteActive))

  const [isActive, setIsActive] = useState(website.isActive)
  const debounce = useDebounce(isActive, 500)

  useEffect(() => {
    if (website.isActive === isActive) return
    toggleWebsiteActive(websiteId)
  }, [debounce, websiteId, toggleWebsiteActive])

  return <Switch checked={isActive} onCheckedChange={setIsActive} className="scale-90 cursor-pointer" />
})

export default WebsiteActiveToggle
