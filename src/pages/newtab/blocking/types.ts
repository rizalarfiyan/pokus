type Id = string | number

type Column = {
  id: Id
  title: string
}

type Task = {
  id: Id
  columnId: Id
  title: string
  domain: string
  isEnable: boolean
}

export type { Id, Column, Task }
