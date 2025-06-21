import useBlocking from './store'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Id } from './types'

const WebsiteAction = memo(({ websiteId, groupId }: { websiteId: Id; groupId: Id }) => {
  const deleteWebsite = useBlocking(useShallow(state => state.deleteWebsite))

  const handleDelete = useCallback(() => {
    if (window.confirm('Apakah Anda yakin ingin menghapus website ini?')) {
      deleteWebsite(websiteId, groupId)
    }
  }, [deleteWebsite, websiteId, groupId])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-6 p-0">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">
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
