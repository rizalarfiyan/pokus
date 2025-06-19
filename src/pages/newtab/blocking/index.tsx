import Column from './column'
import Task from './task'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Column as IColumn, Id, Task as ITask } from './types'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'

const Blocking = () => {
  const [columns, setColumns] = useState<IColumn[]>([])
  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
  const [activeTask, setActiveTask] = useState<ITask | null>(null)
  const [tasks, setTasks] = useState<ITask[]>([])
  const columnsId = useMemo(() => columns.map(col => col.id), [columns])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
  )

  const createNewColumn = () => {
    const columnToAdd: IColumn = {
      id: nanoid(),
      title: `Column ${columns.length + 1}`,
    }
    setColumns([...columns, columnToAdd])
  }

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter(col => col.id !== id)
    setColumns(filteredColumns)

    const newTasks = tasks.filter(t => t.columnId !== id)
    setTasks(newTasks)
  }

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map(col => {
      if (col.id !== id) return col
      return { ...col, title }
    })
    setColumns(newColumns)
  }

  const createTask = (columnId: Id) => {
    const newTask: ITask = {
      id: nanoid(),
      columnId,
      title: `Task ${tasks.length + 1}`,
      domain: 'example.com',
      isEnable: true,
    }
    setTasks([...tasks, newTask])
  }

  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter(task => task.id !== id)
    setTasks(newTasks)
  }

  const updateTask = (id: Id, title: string, domain: string, isEnable: boolean) => {
    const newTasks = tasks.map(task => {
      if (task.id !== id) return task
      return { ...task, title, domain, isEnable }
    })
    setTasks(newTasks)
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column)
      return
    }
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task)
      return
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null)
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeColumnId = active.id
    const overColumnId = over.id
    if (activeColumnId === overColumnId) return

    setColumns(columns => {
      const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)
      const overColumnIndex = columns.findIndex(col => col.id === overColumnId)
      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return
    const isActiveATask = active.data.current?.type === 'Task'
    const isOverATask = over.data.current?.type === 'Task'

    if (!isActiveATask) return

    if (isActiveATask && isOverATask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId)
        const overIndex = tasks.findIndex(t => t.id === overId)
        tasks[activeIndex].columnId = tasks[overIndex].columnId
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === 'Column'
    if (isActiveATask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId)
        tasks[activeIndex].columnId = overId
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }

  return (
    <ScrollArea className="scrollbar scrollbar-thumb-background scrollbar-track-transparent flex flex-1 flex-col overflow-x-auto overflow-y-hidden pb-4 backdrop-blur-sm">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="bg-background/20 m-auto flex min-w-full flex-1 gap-4 rounded-lg p-4">
          {columnsId.length > 0 && (
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map(col => (
                  <Column
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    tasks={tasks.filter(task => task.columnId === col.id)}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </SortableContext>
            </div>
          )}
          <button
            onClick={() => {
              createNewColumn()
            }}
            className="border-foreground/50 bg-muted/30 flex h-[calc(100vh_-_10rem)] w-80 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 backdrop-blur-sm">
            <div className="text-accent-foreground flex flex-col items-center justify-center gap-2">
              <Plus className="size-10" />
              <span className="font-bold">Add Group</span>
            </div>
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && <Task task={activeTask} deleteTask={deleteTask} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default Blocking
