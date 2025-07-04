import createDeepMerge from '@fastify/deepmerge'
import type { StateCreator, StoreApi } from 'zustand'

type ChromeStorageOptions<T extends object> = {
  name: string
  storageType?: 'local' | 'sync' | 'managed' | 'session'
  mergeCallback?: (value: T) => T
}

const chromeStorage = <T extends object>(
  config: StateCreator<T>,
  options: ChromeStorageOptions<T>,
): StateCreator<T> => {
  const { name, storageType = 'local', mergeCallback = val => val } = options
  const storage = chrome.storage[storageType]

  const deepMerge = createDeepMerge()
  let isUpdateFromLocal = false

  type StoreApiDestroy = StoreApi<T> & { destroy?: () => void }

  return (set, get, api: StoreApiDestroy) => {
    const setItem = (value: T): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        storage.set({ [name]: value }, () => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError)
          }
          resolve()
        })
      })

    const getItem = (): Promise<T | null> =>
      new Promise<T | null>((resolve, reject) => {
        storage.get(name, result => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError)
          }
          resolve(result[name] || null)
        })
      })

    const savedSetState = api.setState
    api.setState = (state, replace) => {
      savedSetState(state as T, replace as false | undefined)
      isUpdateFromLocal = true
      void setItem(get())
    }

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[name]) {
        const newState = changes[name].newValue as T
        if (!newState) return

        if (isUpdateFromLocal) {
          isUpdateFromLocal = false
          return
        }

        const mergedState = mergeCallback(deepMerge(get(), newState) as T)
        set(mergedState as Partial<T>)
      }
    }

    storage.onChanged.addListener(listener)

    // Destroy function to remove the listener
    const originalDestroy = api.destroy
    api.destroy = () => {
      chrome.storage.onChanged.removeListener(listener)
      if (originalDestroy) originalDestroy()
    }

    getItem()
      .then(storedState => {
        if (storedState) {
          const mergedState = mergeCallback(deepMerge(get(), storedState) as T)
          set(mergedState as Partial<T>)
        }
      })
      .catch(console.error)

    return config(api.setState, get, api)
  }
}

export default chromeStorage
