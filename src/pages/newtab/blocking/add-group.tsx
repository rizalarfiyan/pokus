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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Plus } from 'lucide-react'
import { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as v from 'valibot'
import { useShallow } from 'zustand/react/shallow'

const schema = v.object({
  name: v.pipe(
    v.string('Group name is required'),
    v.minLength(3, 'Needs to be at least 3 characters'),
    v.maxLength(50, 'Needs to be at most 50 characters'),
    v.trim(),
  ),
})

type ISchema = v.InferInput<typeof schema>

const AddGroup = memo(() => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const addGroupAction = useBlocking(useShallow(state => state.addGroup))

  const form = useForm<ISchema>({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = (data: ISchema) => {
    addGroupAction(data.name)
    form.reset()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-foreground/50 bg-muted/30 m-2 flex h-[calc(100vh_-_10rem)] w-80 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 backdrop-blur-sm">
          <div className="text-accent-foreground flex flex-col items-center justify-center gap-2">
            <Plus className="size-10" />
            <span className="font-bold">Add Group</span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Group</DialogTitle>
          <DialogDescription>Create a new group to blocking your websites.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
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
              <Button type="submit">Add Group</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

export default AddGroup
