import WebsiteAction from './website-action'
import WebsiteActiveToggle from './website-active-toggle'
import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'
import { memo } from 'react'
import type { Id, WebsiteType } from './types'
import type { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd'

interface WebsiteContentProps {
  websiteId: Id
  groupId: Id
  website: WebsiteType
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
}

const WebsiteContent = memo(({ websiteId, groupId, website, provided, snapshot }: WebsiteContentProps) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    className={cn(
      'bg-muted text-foreground mb-3 flex items-center gap-2 rounded-md p-2',
      snapshot.isDragging ? 'bg-green-200 shadow-lg' : 'bg-background',
    )}>
    <div
      {...provided.dragHandleProps}
      className="text-muted-foreground hover:text-foreground drag-handle cursor-grab transition-colors hover:cursor-grabbing">
      <GripVertical className="size-4" />
    </div>
    <img
      src={`https://www.google.com/s2/favicons?sz=32&domain=https://${website.domain}`}
      alt={`${website.name} favicon`}
      className="size-6 flex-shrink-0 rounded"
      onError={e => {
        e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='
      }}
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{website.name}</p>
      <p className="text-muted-foreground truncate text-xs">{website.domain}</p>
    </div>
    <div className="flex flex-shrink-0 items-center gap-2">
      <WebsiteActiveToggle websiteId={websiteId} website={website} />
      <WebsiteAction websiteId={websiteId} groupId={groupId} website={website} />
    </div>
  </div>
))

export default WebsiteContent
