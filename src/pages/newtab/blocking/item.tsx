import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { GripVertical, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

type KanbanItem = {
  id: string
  name: string
  domain: string
  enabled: boolean
}

interface ItemProps {
  item: KanbanItem
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

const Item = ({ item, onToggle, onEdit, onDelete }: ItemProps) => (
  <div className="flex items-center gap-3">
    <div className="text-muted-foreground hover:text-foreground drag-handle cursor-grab transition-colors hover:cursor-grabbing">
      <GripVertical className="h-4 w-4" />
    </div>
    <img
      src={`https://www.google.com/s2/favicons?sz=32&domain=https://${item.domain}`}
      alt={`${item.name} favicon`}
      className="h-6 w-6 flex-shrink-0 rounded"
      onError={e => {
        e.currentTarget.src = '/placeholder.svg?height=24&width=24'
      }}
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{item.name}</p>
      <p className="text-muted-foreground truncate text-xs">{item.domain}</p>
    </div>
    <div className="flex flex-shrink-0 items-center gap-2">
      <Switch checked={item.enabled} onCheckedChange={onToggle} className="scale-75" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
)

export default Item
