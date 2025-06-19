import Blocking from './blocking'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartLine, GlobeLock, ListMusic, Target, Trophy } from 'lucide-react'
import { useState } from 'react'

const tabsContents = [
  {
    value: 'home',
    label: 'Home',
    content: 'Page Home!',
    icon: <Target className="size-5" />,
  },
  {
    value: 'blocking',
    label: 'Blocking',
    content: <Blocking />,
    icon: <GlobeLock className="size-5" />,
  },
  {
    value: 'ambience',
    label: 'Ambience',
    content: 'Page Ambience!',
    icon: <ListMusic className="size-5" />,
  },
  {
    value: 'statistic',
    label: 'Statistic',
    content: 'Page Statistic!',
    icon: <ChartLine className="size-5" />,
  },
  {
    value: 'achievement',
    label: 'Achievement',
    content: 'Page Achievement!',
    icon: <Trophy className="size-5" />,
  },
]

interface TabListProps {
  before?: React.ReactNode
  after?: React.ReactNode
}

const TabList = ({ before, after }: TabListProps) => {
  const [activeTab, setActiveTab] = useState(tabsContents[0].value)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-screen flex-1 items-center gap-4 p-4">
      <div className="flex w-full items-center justify-between px-2">
        {before}
        <TabsList className="bg-muted/10 mx-auto h-auto gap-3 p-2">
          {tabsContents.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-background data-[state=active]:text-primary p-2 px-4 font-bold">
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {after}
      </div>
      {tabsContents.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="container mx-auto flex flex-1 flex-col">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default TabList
