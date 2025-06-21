import Group from './group'
import useBlocking from './store'
import { Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'

const Board = memo(() => {
  const { groupOrder, onGroup } = useBlocking(
    useShallow(state => ({
      groupOrder: state.groupOrder,
      onGroup: state.onGroup,
    })),
  )

  const onAddGroup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onGroup({ type: 'create' })
  }

  return (
    <Droppable droppableId="all-groups" direction="horizontal" type="column">
      {provided => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="flex">
          {groupOrder.map((groupId, index) => (
            <Group key={groupId} groupId={groupId} index={index} />
          ))}
          {provided.placeholder}
          <button
            type="button"
            onClick={onAddGroup}
            className="border-background bg-muted/20 hover:bg-primary/10 m-2 flex h-[calc(100vh_-_10rem)] w-[23rem] cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 backdrop-blur-sm transition-colors duration-300">
            <div className="text-accent-foreground flex flex-col items-center justify-center gap-2">
              <Plus className="size-10" />
              <span className="font-bold">Add Group</span>
            </div>
          </button>
        </div>
      )}
    </Droppable>
  )
})

export default Board
