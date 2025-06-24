interface ISession {
  id?: number
  start_date: number
  end_date: number
  type: 'focus' | 'short' | 'long'
  has_valid_cycle: boolean
}

interface IDailyStat {
  id?: number
  date: number

  focus: number
  short: number
  long: number
  nc_focus: number
  nc_short: number
  nc_long: number

  time_focus: number
  time_short: number
  time_long: number
  time_nc_focus: number
  time_nc_short: number
  time_nc_long: number
}

export type { ISession, IDailyStat }
