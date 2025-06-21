import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { DndContext, rectIntersection, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { ReactNode } from 'react'

type KanbanBoardProps = {
  id: string
  children: ReactNode
  className?: string
}

const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      className={cn(
        'bg-secondary/50 flex h-full min-h-96 flex-col gap-3 rounded-lg border p-4 shadow-sm outline-2 transition-all',
        isOver ? 'outline-primary bg-secondary' : 'outline-transparent',
        className,
      )}
      ref={setNodeRef}>
      {children}
    </div>
  )
}

type KanbanCardProps = {
  id: string
  name: string
  index: number
  parent: string
  children?: ReactNode
  className?: string
}

const KanbanCard = ({ id, name, index, parent, children, className }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { index, parent },
  })

  return (
    <Card
      className={cn(
        'bg-background rounded-lg p-3 shadow-sm transition-shadow hover:shadow-md',
        isDragging && 'opacity-50',
        className,
      )}
      style={{
        transform: transform ? `translateX(${transform.x}px) translateY(${transform.y}px)` : 'none',
      }}
      ref={setNodeRef}>
      <div {...listeners} {...attributes} className="contents" style={{ touchAction: 'none' }}>
        {children ?? <p className="m-0 text-sm font-medium">{name}</p>}
      </div>
    </Card>
  )
}

type KanbanCardsProps = {
  children: ReactNode
  className?: string
}

const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div className={cn('flex flex-1 flex-col gap-3', className)}>{children}</div>
)

type KanbanHeaderProps = {
  children: ReactNode
  className?: string
}

const KanbanHeader = ({ children, className }: KanbanHeaderProps) => (
  <div className={cn('flex shrink-0 items-center border-b pb-2', className)}>{children}</div>
)

type KanbanProviderProps = {
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
  className?: string
}

const KanbanProvider = ({ children, onDragEnd, className }: KanbanProviderProps) => (
  <DndContext collisionDetection={rectIntersection} onDragEnd={onDragEnd}>
    <div className={cn('flex', className)}>{children}</div>
  </DndContext>
)

export { KanbanBoard, KanbanCard, KanbanCards, KanbanHeader, KanbanProvider }
export type {
  DragEndEvent,
  KanbanBoardProps,
  KanbanCardProps,
  KanbanCardsProps,
  KanbanHeaderProps,
  KanbanProviderProps,
}
