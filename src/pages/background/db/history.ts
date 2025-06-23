import dayjs from 'dayjs'
import Dexie from 'dexie'
import type { Table } from 'dexie'

interface ISession {
  id?: number
  start_date: number
  end_date: number
  type: 'pomodoro' | 'sort' | 'long'
  has_valid_cycle: boolean
}

interface IPerDayStatistics {
  id?: number
  date: number

  pomodoro: number
  sort: number
  long: number
  nc_pomodoro: number
  nc_sort: number
  nc_long: number

  time_pomodoro: number
  time_sort: number
  time_long: number
  time_nc_pomodoro: number
  time_nc_sort: number
  time_nc_long: number
}

class HistoryDB extends Dexie {
  public sessions!: Table<ISession>

  public dailyStats!: Table<IPerDayStatistics>

  constructor() {
    super('history')
    this.version(1).stores({
      sessions: '++id, start_date, end_date',
      dailyStats: '++id, date',
    })
  }

  public async addSession(session: Omit<ISession, 'id'>): Promise<void> {
    try {
      await this.transaction('rw', this.sessions, this.dailyStats, async () => {
        await this.sessions.add(session)
        await this.updateDailyStats(session)
      })
    } catch (error) {
      console.warn('Failed to save update user statistics:', error)
    }
  }

  private async updateDailyStats(session: Omit<ISession, 'id'>): Promise<void> {
    const startOfDay = dayjs(session.end_date).startOf('day').unix()
    const duration = session.end_date - session.start_date

    const existingDayStat = await this.dailyStats.where('date').equals(startOfDay).first()
    const counterField = `${session.has_valid_cycle ? '' : 'nc_'}${session.type}` as keyof IPerDayStatistics
    const timeField = `time_${session.has_valid_cycle ? '' : 'nc_'}${session.type}` as keyof IPerDayStatistics

    if (existingDayStat) {
      await this.dailyStats.update(existingDayStat.id!, {
        [counterField]: ((existingDayStat[counterField] as number) || 0) + 1,
        [timeField]: ((existingDayStat[timeField] as number) || 0) + duration,
      })
    } else {
      const newDayStat: IPerDayStatistics = {
        date: startOfDay,
        pomodoro: 0,
        sort: 0,
        long: 0,
        nc_pomodoro: 0,
        nc_sort: 0,
        nc_long: 0,
        time_pomodoro: 0,
        time_sort: 0,
        time_long: 0,
        time_nc_pomodoro: 0,
        time_nc_sort: 0,
        time_nc_long: 0,
      }

      newDayStat[counterField] = 1
      newDayStat[timeField] = duration

      await this.dailyStats.add(newDayStat)
    }
  }
}

export type { ISession, IPerDayStatistics }
export default HistoryDB
