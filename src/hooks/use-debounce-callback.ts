import deepEqual from 'fast-deep-equal'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'

const useDebounceCallback = <T>(
  sourceValue: T,
  updateCallback: (newValue: T) => void,
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

    if (deepEqual(localValue, sourceValue)) return

    timeoutRef.current = setTimeout(() => {
      memoizedUpdateCallback(localValue)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [localValue, sourceValue, memoizedUpdateCallback, delay])

  return [localValue, setLocalValue]
}

export default useDebounceCallback
