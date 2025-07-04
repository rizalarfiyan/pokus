import { useModalBlocking } from './store'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Id, WebsiteType } from './types'

interface WebsiteActionProps {
  websiteId: Id
  groupId: Id
  website: WebsiteType
}

const WebsiteAction = memo(({ websiteId, groupId, website }: WebsiteActionProps) => {
  const { onDelete, onWebsite } = useModalBlocking(
    useShallow(state => ({
      onDelete: state.onDelete,
      onWebsite: state.onWebsite,
    })),
  )

  const handleEditWebsite = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onWebsite({
        groupId,
        domain: website.domain,
        id: websiteId,
        name: website.name,
        type: 'edit',
      })
    },
    [onWebsite, groupId, website, websiteId, website],
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onDelete({
        id: websiteId,
        type: 'website',
        groupId,
        name: website.name,
      })
    },
    [onDelete, websiteId, groupId, website],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-6 p-0">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleEditWebsite}>
          <Edit />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleDelete}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

export default WebsiteAction
