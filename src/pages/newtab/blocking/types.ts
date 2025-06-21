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

interface ModalGroupCreate {
  type: 'create'
}

interface ModalGroupEdit {
  id: Id
  name: string
  type: 'edit'
}

type ModalGroup = ModalGroupCreate | ModalGroupEdit

interface ModalWebsiteCreate {
  type: 'create'
  groupId: Id
}

interface ModalWebsiteEdit {
  id: Id
  groupId: Id
  name: string
  domain: string
  type: 'edit'
}

type ModalWebsite = ModalWebsiteCreate | ModalWebsiteEdit

interface State {
  websites: Record<Id, WebsiteType>
  groups: Record<Id, GroupType>
  groupOrder: Id[]
}

type Actions = {
  addWebsite: (groupId: Id, name: string, domain: string) => void
  updateWebsite: (websiteId: Id, groupId: Id, name: string, domain: string) => void
  deleteWebsite: (websiteId: Id, groupId: Id) => void
  addGroup: (name: string) => void
  updateGroup: (id: Id, name: string) => void
  deleteGroup: (groupId: Id) => void
  toggleWebsiteActive: (websiteId: Id) => void
  handleDragEnd: (result: DropResult) => void
}

type StateAction = State & Actions

interface ModalState {
  delete: DeleteAction | null
  group: ModalGroup | null
  website: ModalWebsite | null
}

type ModalActions = {
  onDelete: (state: DeleteAction | null) => void
  onGroup: (state: ModalGroup | null) => void
  onWebsite: (state: ModalWebsite | null) => void
}

type ModalStateAction = ModalState & ModalActions

export type { Actions, GroupType, Id, State, StateAction, WebsiteType, ModalGroup, ModalWebsite, ModalStateAction }
