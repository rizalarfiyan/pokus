import Pomodoro from './pomodoro'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings2, SettingsIcon, Timer } from 'lucide-react'

const tabsContents = [
  {
    value: 'general',
    label: 'General',
    content: <div className="px-4">General settings for the new tab experience.</div>,
    icon: Settings2,
  },
  {
    value: 'pomodoro',
    label: 'Pomodoro',
    content: <Pomodoro />,
    icon: Timer,
  },
]

const SettingTabs = () => (
  <Tabs defaultValue={tabsContents[0].value} className="gap-4">
    <TabsList className="h-auto w-full gap-2 p-2">
      {tabsContents.map(tab => (
        <TabsTrigger key={tab.value} value={tab.value} className="py-2">
          <tab.icon className="size-5" />
          <span>{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
    {tabsContents.map(tab => (
      <TabsContent key={tab.value} value={tab.value}>
        <ScrollArea type="always" className="h-[calc(100vh-12rem)] overflow-y-auto p-4 pt-0">
          {tab.content}
        </ScrollArea>
      </TabsContent>
    ))}
  </Tabs>
)

const Settings = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button size="icon" variant="secondary" type="button">
        <SettingsIcon />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="sm:max-w-lg">
      <SheetHeader className="text-center">
        <SheetTitle className="flex justify-center">
          <div className="flex items-end">
            <Logo className="size-12" baseClassName="fill-foreground" arrowClassName="fill-primary" />
            <h1 className="text-foreground -mb-1 -ml-2 text-[2.5rem] leading-none font-bold">okus</h1>
          </div>
        </SheetTitle>
        <SheetDescription>Customize your new tab experience with various settings and options.</SheetDescription>
      </SheetHeader>
      <SettingTabs />
    </SheetContent>
  </Sheet>
)

export default Settings
