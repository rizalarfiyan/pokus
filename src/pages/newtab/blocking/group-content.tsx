import useBlocking from './store'
import WebsiteList from './website-list'
import { Button } from '@/components/ui/button'
import { GripVertical, PlusIcon, Trash2 } from 'lucide-react'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { GroupType, Id } from './types'
import type { DraggableProvided } from '@hello-pangea/dnd'

interface GroupContentProps {
  group: GroupType
  groupId: Id
  provided: DraggableProvided
}

const GroupContent = ({ groupId, group, provided }: GroupContentProps) => {
  const { addWebsite, onDelete } = useBlocking(
    useShallow(state => ({
      addWebsite: state.addWebsite,
      onDelete: state.onDelete,
    })),
  )

  const handleAddWebsite = useCallback(() => {
    const name = prompt('Masukkan nama website (misal: Situs Berita):')
    if (name) {
      const domain = prompt('Masukkan domain (misal: news.com):')
      if (domain) {
        addWebsite(groupId, name, domain)
      }
    }
  }, [addWebsite, groupId])

  const handleDelete = useCallback(() => {
    onDelete({
      id: groupId,
      type: 'group',
      name: group.name,
    })
  }, [onDelete, groupId])

  return (
    <div
      {...provided.draggableProps}
      ref={provided.innerRef}
      className="border-foreground/50 bg-muted/30 m-2 flex h-[calc(100vh_-_10rem)] w-80 flex-col overflow-hidden rounded-lg backdrop-blur-sm">
      <div className="bg-muted text-foreground flex items-center justify-between rounded-b-none px-2 py-3 font-bold">
        <div className="flex items-center gap-2">
          <div {...provided.dragHandleProps} className="cursor-grab">
            <GripVertical className="size-5" />
          </div>
          <h3 className="max-w-52 truncate text-lg font-bold">{group.name}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Button className="size-7" size="icon" variant="default" onClick={handleAddWebsite}>
            <PlusIcon />
          </Button>
          <Button className="size-7" size="icon" variant="destructive" onClick={handleDelete}>
            <Trash2 />
          </Button>
        </div>
      </div>
      <WebsiteList websiteIds={group.websiteIds} groupId={group.id} />
    </div>
  )
}

export default GroupContent
