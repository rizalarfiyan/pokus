import { useState, useEffect, useRef, useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'

const useDebouncedToggle = <T>(
  sourceValue: T,
  updateCallback: () => void,
  delay: number,
): [T, Dispatch<SetStateAction<T>>] => {
  const [localValue, setLocalValue] = useState<T>(sourceValue)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const memoizedUpdateCallback = useCallback(updateCallback, [updateCallback])

  useEffect(() => {
    setLocalValue(sourceValue)
  }, [sourceValue])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (localValue === sourceValue) {
      return
    }

    timeoutRef.current = setTimeout(() => {
      memoizedUpdateCallback()
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [localValue, sourceValue, memoizedUpdateCallback, delay])

  return [localValue, setLocalValue]
}

export default useDebouncedToggle
