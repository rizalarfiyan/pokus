import { useState, useEffect, useRef, useCallback } from 'react'
import type { ITimer } from '@/pages/background/timer'

type SendCommand = (action: string, payload?: unknown) => void

const useTimer = (): [ITimer | null, SendCommand] => {
  const [timer, setTimer] = useState<ITimer | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const sendCommand: SendCommand = useCallback((action, payload) => {
    chrome.runtime.sendMessage(
      { action, ...(typeof payload === 'object' && payload !== null ? payload : {}) },
      (response: ITimer) => {
        if (!chrome.runtime.lastError) {
          setTimer(response)
        }
      },
    )
  }, [])

  useEffect(() => {
    const messageListener = (message: { action: string; data: ITimer }) => {
      if (message.action === 'timerUpdate' && message.data) {
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current)
        }
        setTimer(message.data)
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)

    let retryCount = 0
    const maxRetries = 5
    const retryDelay = 250

    const requestInitialState = () => {
      if (timer) return

      sendCommand('getTimer') // Retry if the background script is not ready
      chrome.runtime.sendMessage({ action: 'getTimer' }, (response: ITimer) => {
        if (chrome.runtime.lastError) {
          if (retryCount < maxRetries) {
            retryCount++
            retryTimeoutRef.current = setTimeout(requestInitialState, retryDelay)
          } else {
            console.error('Failed to get timer state after multiple retries.')
          }
        } else {
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current)
          }
          setTimer(response)
        }
      })
    }

    requestInitialState()

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [sendCommand])

  return [timer, sendCommand]
}

export default useTimer
