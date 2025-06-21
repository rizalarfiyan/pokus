import useBlocking from './store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'

const DeleteItem = () => {
  const { deleteState, onDelete, deleteWebsite, deleteGroup } = useBlocking(
    useShallow(state => ({
      deleteState: state.deleteState,
      onDelete: state.onDelete,
      deleteWebsite: state.deleteWebsite,
      deleteGroup: state.deleteGroup,
    })),
  )

  const onOpenChange = (open: boolean) => {
    if (!open) onDelete(null)
  }

  const onConfirm = useCallback(() => {
    if (!deleteState) return
    const { id, type } = deleteState
    if (type === 'website') return deleteWebsite(id, deleteState.groupId)
    deleteGroup(id)
  }, [deleteState])

  if (!deleteState) return null
  const { type, name } = deleteState
  const isGroup = type === 'group'

  return (
    <AlertDialog open={!!deleteState} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {isGroup ? 'Group' : 'Website'}</AlertDialogTitle>
          <AlertDialogDescription>
            {isGroup
              ? `Are you sure you want to delete the "${name}" group? This will permanently delete the group and all items within it. This action cannot be undone.`
              : `Are you sure you want to delete "${name}"? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteItem
