import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GroupType, State, StateAction, WebsiteType } from './types'

const initialData: State = {
  websites: {
    '1': {
      id: '1',
      name: 'Facebook',
      domain: 'facebook.com',
      isActive: true,
    },
    '2': {
      id: '2',
      name: 'Instagram',
      domain: 'instagram.com',
      isActive: true,
    },
    '3': {
      id: '3',
      name: 'X (Twitter)',
      domain: 'x.com',
      isActive: true,
    },
    '4': {
      id: '4',
      name: 'TikTok',
      domain: 'tiktok.com',
      isActive: true,
    },
    '5': {
      id: '5',
      name: 'LinkedIn',
      domain: 'linkedin.com',
      isActive: false,
    },
    '6': {
      id: '6',
      name: 'YouTube',
      domain: 'youtube.com',
      isActive: true,
    },
    '7': {
      id: '7',
      name: 'Netflix',
      domain: 'netflix.com',
      isActive: true,
    },
    '8': {
      id: '8',
      name: 'Steam Store',
      domain: 'store.steampowered.com',
      isActive: true,
    },
    '9': {
      id: '9',
      name: 'Disney+ Hotstar',
      domain: 'hotstar.com',
      isActive: false,
    },
    '10': {
      id: '10',
      name: 'Detik.com',
      domain: 'detik.com',
      isActive: true,
    },
    '11': {
      id: '11',
      name: 'Kompas.com',
      domain: 'kompas.com',
      isActive: true,
    },
    '12': {
      id: '12',
      name: 'CNN Indonesia',
      domain: 'cnnindonesia.com',
      isActive: true,
    },
    '13': {
      id: '13',
      name: 'Tokopedia',
      domain: 'tokopedia.com',
      isActive: true,
    },
    '14': {
      id: '14',
      name: 'Shopee',
      domain: 'shopee.co.id',
      isActive: true,
    },
    '15': {
      id: '15',
      name: 'Lazada',
      domain: 'lazada.co.id',
      isActive: true,
    },
  },
  groups: {
    'social-media': {
      id: 'social-media',
      name: 'Social Media',
      websiteIds: ['1', '2', '3', '4', '5'],
    },
    'streaming-gaming': {
      id: 'streaming-gaming',
      name: 'Streaming & Gaming',
      websiteIds: ['6', '7', '8', '9'],
    },
    news: {
      id: 'news',
      name: 'News',
      websiteIds: ['10', '11', '12'],
    },
    shopping: {
      id: 'shopping',
      name: 'Shopping',
      websiteIds: ['13', '14', '15'],
    },
  },
  groupOrder: ['social-media', 'streaming-gaming', 'news', 'shopping'],
}

const useBlocking = create<StateAction>()(
  persist(
    set => ({
      ...initialData,
      addWebsite: (groupId, name, domain) => {
        const newWebsiteId = `site-${crypto.randomUUID()}`
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
        const newGroupId = `group-${crypto.randomUUID()}`
        const newGroup: GroupType = { id: newGroupId, name, websiteIds: [] }
        set(state => ({
          groups: { ...state.groups, [newGroupId]: newGroup },
          groupOrder: [...state.groupOrder, newGroupId],
        }))
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
    }),
    {
      name: 'blocking',
    },
  ),
)

export default useBlocking
