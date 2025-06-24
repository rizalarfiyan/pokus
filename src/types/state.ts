interface ZustandState<T extends object> {
  state: T
  version: number
}

export type { ZustandState }
