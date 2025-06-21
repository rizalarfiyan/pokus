import AddGroup from './add-group'
import Group from './group'
import useBlocking from './store'
import { Droppable } from '@hello-pangea/dnd'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'

const Board = memo(() => {
  const groupOrder = useBlocking(useShallow(state => state.groupOrder))

  return (
    <Droppable droppableId="all-groups" direction="horizontal" type="column">
      {provided => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="flex">
          {groupOrder.map((groupId, index) => (
            <Group key={groupId} groupId={groupId} index={index} />
          ))}
          {provided.placeholder}
          <AddGroup />
        </div>
      )}
    </Droppable>
  )
})

export default Board
