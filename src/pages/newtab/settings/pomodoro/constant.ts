import type { TimePreset, Preset, PresetItem, Notification } from './types'

const timePreset: Record<Exclude<Preset, 'custom'>, TimePreset> = {
  'sort-burst': {
    focus: 15,
    short: 3,
    long: 10,
  },
  classic: {
    focus: 25,
    short: 5,
    long: 15,
  },
  extended: {
    focus: 45,
    short: 10,
    long: 30,
  },
  'deep-work': {
    focus: 60,
    short: 15,
    long: 45,
  },
}

const presetList: PresetItem[] = [
  {
    value: 'sort-burst',
    name: 'Sort Burst',
    description: 'Short bursts of focused work with minimal breaks.',
  },
  {
    value: 'classic',
    name: 'Classic',
    description: 'The traditional Pomodoro technique with balanced intervals.',
  },
  {
    value: 'extended',
    name: 'Extended',
    description: 'Longer focus sessions for deep concentration.',
  },
  {
    value: 'deep-work',
    name: 'Deep Work',
    description: 'Maximized focus for intense and prolonged work sessions.',
  },
  {
    value: 'custom',
    name: 'Custom',
    description: 'Personalized intervals tailored to your preferences.',
  },
]

const notification: Notification = {
  focus: {
    desktop: true,
    newTab: true,
    audio: null,
  },
  short: {
    desktop: true,
    newTab: false,
    audio: null,
  },
  long: {
    desktop: true,
    newTab: false,
    audio: null,
  },
}

export { timePreset, presetList, notification }
