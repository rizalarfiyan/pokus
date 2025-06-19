import TabList from './TabList'

const IMAGE =
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'

const App = () => (
  <div
    className="h-full min-h-screen w-full bg-cover bg-center font-bold text-white"
    style={{
      backgroundImage: `url(${IMAGE})`,
    }}>
    <div className="container mx-auto flex h-full min-h-screen w-full flex-col py-10">
      <TabList />
    </div>
  </div>
)

export default App
