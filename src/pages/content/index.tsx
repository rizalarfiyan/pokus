import { createRoot } from 'react-dom/client'

const div = document.createElement('div')
div.id = '__root'
document.body.appendChild(div)

const root = document.querySelector('#__root')
if (!root) throw new Error("Can't find root element")

const content = createRoot(root)
content.render(
  <div className='absolute bottom-0 left-0 text-lg text-black bg-amber-400 z-50'  >
    content script <span className='your-class'>loaded</span>
  </div>
)

try {
  console.log('content script loaded')
} catch (e) {
  console.error(e)
}
