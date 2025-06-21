import type { DropResult } from '@hello-pangea/dnd'

type Id = string

interface WebsiteType {
  id: Id
  name: string
  domain: string
  isActive?: boolean
}

interface GroupType {
  id: Id
  name: string
  websiteIds: Id[]
}

interface State {
  websites: { [key: Id]: WebsiteType }
  groups: { [key: Id]: GroupType }
  groupOrder: Id[]
}

type Actions = {
  addWebsite: (groupId: Id, name: string, domain: string) => void
  deleteWebsite: (websiteId: Id, groupId: Id) => void
  addGroup: (name: string) => void
  deleteGroup: (groupId: Id) => void
  toggleWebsiteActive: (websiteId: Id) => void
  handleDragEnd: (result: DropResult) => void
}

type StateAction = State & Actions

export type { Actions, GroupType, Id, State, StateAction, WebsiteType }
