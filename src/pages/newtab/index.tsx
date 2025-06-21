import App from './app'
import { createRoot } from 'react-dom/client'
import '@assets/css/base.css'

const init = () => {
  const root = document.querySelector('#__root')
  if (!root) throw new Error("Can't find root element")
  const content = createRoot(root)
  content.render(<App />)
}

init()
