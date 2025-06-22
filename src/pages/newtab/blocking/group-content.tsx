import GroupAction from './group-action'
import WebsiteList from './website-list'
import { GripVertical } from 'lucide-react'
import { memo } from 'react'
import type { GroupType, Id } from './types'
import type { DraggableProvided } from '@hello-pangea/dnd'

interface GroupContentProps {
  group: GroupType
  groupId: Id
  provided: DraggableProvided
}

const GroupContent = memo(({ groupId, group, provided }: GroupContentProps) => (
  <div
    {...provided.draggableProps}
    ref={provided.innerRef}
    className="border-foreground/50 bg-muted/30 m-2 flex h-[calc(100vh_-_10rem)] w-[23rem] flex-col overflow-hidden rounded-lg backdrop-blur-sm">
    <div className="bg-muted text-foreground flex items-center justify-between rounded-b-none px-2 py-3 font-bold">
      <div className="flex items-center gap-2">
        <div {...provided.dragHandleProps} className="cursor-grab">
          <GripVertical className="size-5" />
        </div>
        <h3 className="max-w-52 truncate text-lg font-bold">{group.name}</h3>
      </div>
      <GroupAction group={group} groupId={groupId} />
    </div>
    <WebsiteList websiteIds={group.websiteIds} groupId={group.id} />
  </div>
))

export default GroupContent
