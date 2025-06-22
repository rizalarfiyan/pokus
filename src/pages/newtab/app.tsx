import FullScreen from './partials/full-screen'
import Theme from './partials/theme'
import Settings from './settings'
import TabList from './tab-list'
import Logo from '@/components/logo'

const IMAGE =
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'

const App = () => (
  <div
    className="relative h-full min-h-screen w-full bg-cover bg-center text-white"
    style={{
      backgroundImage: `url(${IMAGE})`,
    }}>
    <TabList
      before={
        <div className="flex items-end">
          <Logo className="size-8" baseClassName="fill-background" arrowClassName="fill-background" />
          <h1 className="-mb-1 -ml-1 text-3xl leading-none font-bold">okus</h1>
        </div>
      }
      after={
        <div className="flex items-center gap-2">
          <Theme />
          <FullScreen />
        </div>
      }
    />
    <div className="fixed bottom-4 left-4">
      <Settings />
    </div>
  </div>
)

export default App
