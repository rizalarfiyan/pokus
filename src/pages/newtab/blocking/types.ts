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

interface DeleteActionWebsite {
  id: Id
  groupId: Id
  type: 'website'
  name: string
}

interface DeleteActionGroup {
  id: Id
  type: 'group'
  name: string
}

type DeleteAction = DeleteActionWebsite | DeleteActionGroup

interface InitialState {
  websites: Record<Id, WebsiteType>
  groups: Record<Id, GroupType>
  groupOrder: Id[]
}

interface State extends InitialState {
  deleteState: DeleteAction | null
}

type Actions = {
  addWebsite: (groupId: Id, name: string, domain: string) => void
  deleteWebsite: (websiteId: Id, groupId: Id) => void
  addGroup: (name: string) => void
  deleteGroup: (groupId: Id) => void
  toggleWebsiteActive: (websiteId: Id) => void
  handleDragEnd: (result: DropResult) => void
  onDelete: (state: DeleteAction | null) => void
}

type StateAction = State & Actions

export type { Actions, GroupType, Id, State, InitialState, StateAction, WebsiteType }
