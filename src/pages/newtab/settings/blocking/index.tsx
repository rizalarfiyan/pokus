import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useBlocking from '@/pages/newtab/blocking/store'
import { useShallow } from 'zustand/react/shallow'
import type { BlockingTheme } from '@/types/blocking'

interface IBlockingItem {
  value: BlockingTheme
  name: string
  image: string
}

const list: IBlockingItem[] = [
  {
    value: 'default',
    name: 'Default',
    image: '/theme/default.jpg',
  },
  {
    value: 'theme-1',
    name: 'Zen Focus',
    image: '/theme/theme-1.jpg',
  },
  {
    value: 'theme-2',
    name: 'Digital Void',
    image: '/theme/theme-2.jpg',
  },
  {
    value: 'theme-3',
    name: 'Playful Stop',
    image: '/theme/theme-3.jpg',
  },
]

const Blocking = () => {
  const { theme, changeTheme } = useBlocking(
    useShallow(state => ({
      theme: state.theme,
      changeTheme: state.changeTheme,
    })),
  )

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Theme</h3>
      <RadioGroup className="w-full gap-3" defaultValue={theme} value={theme} onValueChange={changeTheme}>
        {list.map(({ name, value, image }) => {
          const id = `theme-blocking-${value}`
          const idDesc = `${id}-description`

          return (
            <div
              key={value}
              className="border-input/80 has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative w-full space-y-4 rounded-xl border-2 p-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem value={value} id={id} className="sr-only" aria-label={id} aria-describedby={idDesc} />
              <Label
                htmlFor={id}
                className="text-foreground flex cursor-pointer flex-col items-start gap-4 after:absolute after:inset-0">
                <div className="space-y-3 text-center">
                  <img className="h-full w-full rounded-lg" src={image} alt={name} />
                  <h3 className="text-base font-bold">{name}</h3>
                </div>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default Blocking
