import GroupContent from './group-content'
import useBlocking from './store'
import { Draggable } from '@hello-pangea/dnd'
import { Portal } from '@radix-ui/react-portal'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Id } from './types'

interface GroupProps {
  groupId: Id
  index: number
}

const Group = memo(({ groupId, index }: GroupProps) => {
  const { group } = useBlocking(
    useShallow(state => ({
      group: state.groups[groupId],
    })),
  )

  if (!group) return null

  return (
    <Draggable draggableId={group.id} index={index}>
      {(provided, snapshot) =>
        snapshot.isDragging ? (
          <Portal>
            <GroupContent group={group} groupId={groupId} provided={provided} />
          </Portal>
        ) : (
          <GroupContent group={group} groupId={groupId} provided={provided} />
        )
      }
    </Draggable>
  )
})

export default Group
