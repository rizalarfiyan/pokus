import useBlocking from './store'
import WebsiteContent from './website-content'
import { Draggable } from '@hello-pangea/dnd'
import { Portal } from '@radix-ui/react-portal'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Id } from './types'

interface WebsiteItemProps {
  websiteId: Id
  groupId: Id
  index: number
}

const WebsiteItem = memo(({ websiteId, groupId, index }: WebsiteItemProps) => {
  const website = useBlocking(useShallow(state => state.websites[websiteId]))

  if (!website) return null

  return (
    <Draggable draggableId={website.id} index={index}>
      {(provided, snapshot) =>
        snapshot.isDragging ? (
          <Portal>
            <WebsiteContent
              websiteId={website.id}
              groupId={groupId}
              website={website}
              provided={provided}
              snapshot={snapshot}
            />
          </Portal>
        ) : (
          <WebsiteContent
            websiteId={website.id}
            groupId={groupId}
            website={website}
            provided={provided}
            snapshot={snapshot}
          />
        )
      }
    </Draggable>
  )
})

export default WebsiteItem
