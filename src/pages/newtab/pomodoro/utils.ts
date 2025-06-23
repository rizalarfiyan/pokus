const formatTime = (milliseconds: number): string => {
  if (typeof milliseconds !== 'number' || milliseconds < 0) return '00:00'
  const totalSeconds = Math.ceil(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

interface MillisecondsHumanizer {
  value: number
  unit: 'h' | 'm' | 's'
}

const millisecondsHumanizer = (milliseconds: number): MillisecondsHumanizer[] => {
  const base: MillisecondsHumanizer[] = [{ value: 0, unit: 's' }]
  if (milliseconds < 0) return base

  const timeUnits: { unit: MillisecondsHumanizer['unit']; ms: number }[] = [
    { unit: 'h', ms: 3600000 },
    { unit: 'm', ms: 60000 },
    { unit: 's', ms: 1000 },
  ]

  const result: MillisecondsHumanizer[] = []
  let remainingMilliseconds = milliseconds

  for (const { unit, ms } of timeUnits) {
    const value = Math.floor(remainingMilliseconds / ms)

    if (value > 0) {
      result.push({ value, unit })
      remainingMilliseconds %= ms
    }
  }

  if (result.length === 0) return base
  if (result.length > 2) result.splice(2)
  return result
}

const remainingPercent = (duration: number, remainingTime: number): number => {
  if (duration <= 0) return 0
  let elapsedTime = duration - remainingTime
  if (elapsedTime < 0) elapsedTime = 0
  const percentElapsed = (elapsedTime / duration) * 100
  return Math.max(0, Math.min(100, percentElapsed))
}

export { formatTime, millisecondsHumanizer, remainingPercent }
