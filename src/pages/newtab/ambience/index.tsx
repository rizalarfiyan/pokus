import { ambience } from './constants'
import Item from './item'
import type { Ambience } from './type'

const Ambience = () => (
  <div className="container mx-auto mt-5">
    <div className="flex flex-wrap items-center justify-center gap-8">
      {ambience.map(item => (
        <Item key={item.type} ambience={item} />
      ))}
    </div>
  </div>
)

export default Ambience
