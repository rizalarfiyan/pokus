import WebsiteItem from './website-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Droppable } from '@hello-pangea/dnd'
import { memo } from 'react'
import type { Id } from './types'

interface WebsiteListProps {
  websiteIds: Id[]
  groupId: Id
}

const WebsiteList = memo(({ websiteIds, groupId }: WebsiteListProps) => (
  <Droppable droppableId={groupId} type="task">
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={cn(
          'flex flex-grow overflow-y-auto p-3 pr-0 transition-colors duration-200 ease-in-out',
          snapshot.isDraggingOver ? 'bg-primary/30' : 'bg-transparent',
        )}>
        <ScrollArea type="always" className={cn('h-full w-full pr-3')}>
          {websiteIds.map((websiteId, index) => (
            <WebsiteItem key={websiteId} websiteId={websiteId} groupId={groupId} index={index} />
          ))}
          {provided.placeholder}
        </ScrollArea>
      </div>
    )}
  </Droppable>
))

export default WebsiteList
