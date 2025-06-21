import Board from './board'
import useBlocking from './store'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DragDropContext } from '@hello-pangea/dnd'

const Blocking = () => {
  const handleDragEnd = useBlocking(state => state.handleDragEnd)

  return (
    <ScrollArea
      type="always"
      className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden backdrop-blur-sm select-none">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="bg-background/20 m-auto flex min-w-full flex-1 gap-4 rounded-lg p-2">
          <Board />
        </div>
      </DragDropContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default Blocking
