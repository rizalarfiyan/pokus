type Id = string

type BlockingTheme = 'default' | 'theme-1' | 'theme-2' | 'theme-3'

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

interface BlockingSettings {
  websites: Record<Id, WebsiteType>
  groups: Record<Id, GroupType>
  groupOrder: Id[]
  theme: BlockingTheme
}

export type { Id, WebsiteType, GroupType, BlockingSettings, BlockingTheme }
