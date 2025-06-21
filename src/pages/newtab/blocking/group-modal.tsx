import useBlocking from './store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as v from 'valibot'
import { useShallow } from 'zustand/react/shallow'

const schema = v.object({
  name: v.pipe(
    v.string('Group name is required'),
    v.minLength(3, 'Needs to be at least 3 characters'),
    v.maxLength(25, 'Needs to be at most 25 characters'),
    v.trim(),
  ),
})

type ISchema = v.InferInput<typeof schema>

const GroupModal = memo(() => {
  const { groupState, addGroup, updateGroup, onGroup } = useBlocking(
    useShallow(state => ({
      groupState: state.groupState,
      addGroup: state.addGroup,
      updateGroup: state.updateGroup,
      onGroup: state.onGroup,
    })),
  )

  const isEdit = groupState?.type === 'edit'

  const form = useForm<ISchema>({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: isEdit ? groupState.name : '',
    },
  })

  useEffect(() => {
    if (!groupState || !isEdit) return
    form.setValue('name', isEdit ? groupState.name : '')
  }, [groupState])

  const onSubmit = (data: ISchema) => {
    if (isEdit) {
      updateGroup(groupState.id, data.name)
    } else {
      addGroup(data.name)
    }

    form.reset()
    onGroup(null)
  }

  const onOpenChange = (open: boolean) => {
    if (!open) onGroup(null)
  }

  if (!groupState) return null

  return (
    <Dialog open={!!groupState} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Group' : 'Add New Group'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the group details to modify your website blocking settings.'
              : 'Create a new group to block your websites.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name {isEdit ? groupState.name : ''}</FormLabel>
                  <FormControl>
                    <Input placeholder="Social Media" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{isEdit ? 'Edit Group' : 'Add Group'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

export default GroupModal
