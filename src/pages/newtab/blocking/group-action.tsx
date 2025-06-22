import { useModalBlocking } from './store'
import { Button } from '@/components/ui/button'
import { Pencil, PlusIcon, Trash2 } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { GroupType, Id } from './types'

interface GroupActionProps {
  group: GroupType
  groupId: Id
}

const GroupAction = memo(({ group, groupId }: GroupActionProps) => {
  const { onDelete, onGroup, onWebsite } = useModalBlocking(
    useShallow(state => ({
      onDelete: state.onDelete,
      onGroup: state.onGroup,
      onWebsite: state.onWebsite,
    })),
  )

  const handleAddWebsite = useCallback(() => {
    onWebsite({
      groupId,
      type: 'create',
    })
  }, [onWebsite, groupId])

  const handleEditGroup = useCallback(() => {
    onGroup({
      id: groupId,
      type: 'edit',
      name: group.name,
    })
  }, [onGroup, groupId, group])

  const handleDelete = useCallback(() => {
    onDelete({
      id: groupId,
      type: 'group',
      name: group.name,
    })
  }, [onDelete, groupId, group])

  return (
    <div className="flex items-center gap-1.5">
      <Button className="size-7" size="icon" variant="outline" onClick={handleEditGroup}>
        <Pencil />
      </Button>
      <Button className="size-7" size="icon" variant="default" onClick={handleAddWebsite}>
        <PlusIcon />
      </Button>
      <Button className="size-7" size="icon" variant="destructive" onClick={handleDelete}>
        <Trash2 />
      </Button>
    </div>
  )
})

export default GroupAction
