import chromeStorage from '@/storage/zustand'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import type { GroupType, ModalStateAction, StateAction, WebsiteType } from './types'

const useBlocking = create<StateAction>()(
  chromeStorage(
    set => ({
      theme: 'default',
      websites: {},
      groupOrder: [],
      groups: {},
      addWebsite: (groupId, name, domain) => {
        const newWebsiteId = nanoid()
        const newWebsite: WebsiteType = { id: newWebsiteId, name, domain, isActive: true }
        set(state => {
          const group = state.groups[groupId]
          const newWebsiteIds = [...group.websiteIds, newWebsiteId]
          return {
            websites: { ...state.websites, [newWebsiteId]: newWebsite },
            groups: { ...state.groups, [groupId]: { ...group, websiteIds: newWebsiteIds } },
          }
        })
      },
      updateWebsite: (websiteId, groupId, name, domain) => {
        set(state => {
          const website = state.websites[websiteId]
          if (!website) return {}
          const updatedWebsite: WebsiteType = { ...website, name, domain }
          const group = state.groups[groupId]
          return {
            websites: { ...state.websites, [websiteId]: updatedWebsite },
            groups: { ...state.groups, [groupId]: { ...group } },
          }
        })
      },
      deleteWebsite: (websiteId, groupId) => {
        set(state => {
          const newWebsites = { ...state.websites }
          delete newWebsites[websiteId]
          const group = state.groups[groupId]
          const newWebsiteIds = group.websiteIds.filter(id => id !== websiteId)
          return {
            websites: newWebsites,
            groups: { ...state.groups, [groupId]: { ...group, websiteIds: newWebsiteIds } },
          }
        })
      },
      addGroup: name => {
        const newGroupId = nanoid()
        const newGroup: GroupType = { id: newGroupId, name, websiteIds: [] }
        set(state => ({
          groups: { ...state.groups, [newGroupId]: newGroup },
          groupOrder: [...state.groupOrder, newGroupId],
        }))
      },
      updateGroup: (id, name) => {
        set(state => {
          const group = state.groups[id]
          return {
            groups: { ...state.groups, [id]: { ...group, name } },
          }
        })
      },
      deleteGroup: groupId => {
        set(state => {
          const websitesToDelete = state.groups[groupId].websiteIds
          const newWebsites = { ...state.websites }
          websitesToDelete.forEach(websiteId => delete newWebsites[websiteId])
          const newGroups = { ...state.groups }
          delete newGroups[groupId]
          const newGroupOrder = state.groupOrder.filter(id => id !== groupId)
          return { websites: newWebsites, groups: newGroups, groupOrder: newGroupOrder }
        })
      },
      toggleWebsiteActive: websiteId => {
        set(state => {
          const website = state.websites[websiteId]
          if (!website) return {}
          return {
            websites: {
              ...state.websites,
              [websiteId]: { ...website, isActive: !website.isActive },
            },
          }
        })
      },
      handleDragEnd: ({ destination, source, draggableId, type }) => {
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
          return
        }

        set(state => {
          if (type === 'column') {
            const newGroupOrder = Array.from(state.groupOrder)
            newGroupOrder.splice(source.index, 1)
            newGroupOrder.splice(destination.index, 0, draggableId)
            return { groupOrder: newGroupOrder }
          }

          const startGroup = state.groups[source.droppableId]
          const finishGroup = state.groups[destination.droppableId]

          if (startGroup === finishGroup) {
            const newWebsiteIds = Array.from(startGroup.websiteIds)
            newWebsiteIds.splice(source.index, 1)
            newWebsiteIds.splice(destination.index, 0, draggableId)
            const newGroup = { ...startGroup, websiteIds: newWebsiteIds }
            return { groups: { ...state.groups, [newGroup.id]: newGroup } }
          }

          const startWebsiteIds = Array.from(startGroup.websiteIds)
          startWebsiteIds.splice(source.index, 1)
          const newStartGroup = { ...startGroup, websiteIds: startWebsiteIds }

          const finishWebsiteIds = Array.from(finishGroup.websiteIds)
          finishWebsiteIds.splice(destination.index, 0, draggableId)
          const newFinishGroup = { ...finishGroup, websiteIds: finishWebsiteIds }

          return {
            groups: {
              ...state.groups,
              [newStartGroup.id]: newStartGroup,
              [newFinishGroup.id]: newFinishGroup,
            },
          }
        })
      },
      changeTheme: theme => set({ theme }),
    }),
    {
      name: 'blocking',
      storageType: 'sync',
    },
  ),
)

const useModalBlocking = create<ModalStateAction>(set => ({
  delete: null,
  group: null,
  website: null,
  onDelete: state => set({ delete: state }),
  onGroup: state => set({ group: state }),
  onWebsite: state => set({ website: state }),
}))

export default useBlocking
export { useModalBlocking }
