import useBlocking, { useModalBlocking } from './store'
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

const DOMAIN_REGEX = /^(?!-)([a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,6}$/iu

const schema = v.object({
  name: v.pipe(
    v.string('Website name is required'),
    v.minLength(3, 'Needs to be at least 3 characters'),
    v.maxLength(25, 'Needs to be at most 25 characters'),
    v.trim(),
  ),
  domain: v.pipe(
    v.string('Domain is required'),
    v.regex(DOMAIN_REGEX, 'Please enter a valid domain (e.g., rizalarfiyan.com)'),
    v.trim(),
  ),
})

type ISchema = v.InferInput<typeof schema>

const WebsiteModal = memo(() => {
  const { addWebsite, updateWebsite } = useBlocking(
    useShallow(state => ({
      addWebsite: state.addWebsite,
      updateWebsite: state.updateWebsite,
    })),
  )
  const { website, onWebsite } = useModalBlocking(
    useShallow(state => ({
      website: state.website,
      onWebsite: state.onWebsite,
    })),
  )

  const isEdit = website?.type === 'edit'

  const form = useForm<ISchema>({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: '',
      domain: '',
    },
  })

  useEffect(() => {
    if (!website || !isEdit) return
    form.setValue('name', website.name)
    form.setValue('domain', website.domain)
  }, [website])

  const onSubmit = (data: ISchema) => {
    if (!website) return

    if (isEdit) {
      updateWebsite(website.id, website.groupId, data.name, data.domain)
    } else {
      addWebsite(website.groupId, data.name, data.domain)
    }

    form.reset()
    onWebsite(null)
  }

  const onOpenChange = (open: boolean) => {
    if (open) return
    onWebsite(null)
    form.reset()
  }

  if (!website) return null

  return (
    <Dialog open={!!website} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Website' : 'Add New Website'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the website information.' : 'Add a new website to your group.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rizal Arfiyan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="rizalarfiyan.com" {...field} />
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
              <Button type="submit">{isEdit ? 'Edit Website' : 'Add Website'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

export default WebsiteModal
