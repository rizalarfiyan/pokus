const millisecondsHumanizer = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds <= 0) {
    return '0s'
  }

  const units = [
    { value: 24 * 60 * 60 * 1000, suffix: 'd' },
    { value: 60 * 60 * 1000, suffix: 'h' },
    { value: 60 * 1000, suffix: 'm' },
    { value: 1000, suffix: 's' },
  ]

  for (const unit of units) {
    if (milliseconds >= unit.value) {
      const value = Math.floor(milliseconds / unit.value)
      return `${value}${unit.suffix}`
    }
  }

  return '1s'
}

export { millisecondsHumanizer }
