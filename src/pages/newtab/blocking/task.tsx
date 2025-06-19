import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react'
import type { Id, Task as ITask } from './types'

interface TaskProps {
  task: ITask
  deleteTask: (id: Id) => void
}

const Task = ({ task }: TaskProps) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
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
        className="flex-left relative flex h-14 cursor-grab items-center rounded-xl border-2 border-rose-500 p-2.5 opacity-30"
      />
    )
  }

  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className="bg-muted text-foreground flex items-center gap-2 rounded-md p-2">
      <div className="text-muted-foreground hover:text-foreground drag-handle cursor-grab transition-colors hover:cursor-grabbing">
        <GripVertical className="size-5" />
      </div>
      <div className="bg-foreground/20 size-6 flex-shrink-0 rounded">
        <img
          src={`https://www.google.com/s2/favicons?sz=32&domain=https://${task.domain}`}
          alt={`${task.title} favicon`}
          className="h-auto w-full object-center"
          onError={e => {
            e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.title}</p>
        <p className="text-muted-foreground truncate text-xs">{task.domain}</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <Switch checked={task.isEnable} className="scale-75" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Task
