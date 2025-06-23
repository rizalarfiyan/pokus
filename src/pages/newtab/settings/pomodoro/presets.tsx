import { presetList, timePreset } from './constant'
import PresetCustom from './preset-custom'
import StackedBar from './stack-bar'
import usePomodoroSetting from './store'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useShallow } from 'zustand/react/shallow'

const Presets = () => {
  const { preset, changePreset } = usePomodoroSetting(
    useShallow(state => ({
      preset: state.preset,
      changePreset: state.changePreset,
    })),
  )

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Preset</h3>
      <RadioGroup className="w-full gap-3" defaultValue={preset} onValueChange={changePreset}>
        {presetList.map(({ name, value, description }) => {
          const id = `pomodoro-${value}`
          const idDesc = `${id}-description`

          return (
            <div
              key={value}
              className="border-input/80 has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative w-full space-y-4 rounded-lg border-2 p-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem value={value} id={id} className="sr-only" aria-label={id} aria-describedby={idDesc} />
              <Label
                htmlFor={id}
                className="text-foreground flex cursor-pointer flex-col items-start gap-4 after:absolute after:inset-0">
                <div>
                  <h3 className="text-base font-bold">{name}</h3>
                  <p id={idDesc} className="text-muted-foreground text-sm leading-tight">
                    {description}
                  </p>
                </div>
              </Label>
              {value === 'custom' ? <PresetCustom /> : <StackedBar value={timePreset[value]} />}
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default Presets
