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
    content: 'Page Blocking!',
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

const TabList = () => {
  const [activeTab, setActiveTab] = useState(tabsContents[0].value)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="bg-muted/20 mx-auto h-auto gap-3 p-2">
        {tabsContents.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="p-2 px-4">
            {tab.icon}
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsContents.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default TabList
