import Task from './task'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, PlusIcon, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import type { Column as IColumn, Id, Task as ITask } from './types'

interface ColumnProps {
  column: IColumn
  tasks: ITask[]
  deleteColumn: (id: Id) => void
  updateColumn: (id: Id, title: string) => void
  createTask: (columnId: Id) => void
  deleteTask: (id: Id) => void
  updateTask: (id: Id, title: string, domain: string, isEnable: boolean) => void
}

const Column = (props: ColumnProps) => {
  const { column, deleteColumn, createTask, tasks, deleteTask } = props
  const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: 'Column', column },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-accent/40 flex h-[calc(100vh_-_10rem)] w-80 flex-col rounded-lg border-2"></div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-foreground/50 bg-muted/30 flex h-[calc(100vh_-_10rem)] w-80 flex-col overflow-hidden rounded-lg backdrop-blur-sm">
      <div className="bg-muted text-foreground flex items-center justify-between rounded-b-none px-2 py-3 font-bold">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="size-5" />
          </div>
          <h3 className="max-w-52 truncate text-lg font-bold">{column.title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            className="size-7"
            size="icon"
            variant="default"
            onClick={() => {
              createTask(column.id)
            }}>
            <PlusIcon />
          </Button>
          <Button
            className="size-7"
            size="icon"
            variant="destructive"
            onClick={() => {
              deleteColumn(column.id)
            }}>
            <Trash2 />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex flex-grow overflow-y-auto p-3">
        <div className="flex flex-grow flex-col gap-3">
          <SortableContext items={tasksIds}>
            {tasks.map(task => (
              <Task key={task.id} task={task} deleteTask={deleteTask} />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Column
