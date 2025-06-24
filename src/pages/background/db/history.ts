import dayjs from 'dayjs'
import Dexie from 'dexie'
import type { IDailyStat, ISession } from '@/types/database'
import type { Table } from 'dexie'

class HistoryDB extends Dexie {
  public sessions!: Table<ISession, number>
  public dailyStats!: Table<IDailyStat, number>

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
    const counterField = `${session.has_valid_cycle ? '' : 'nc_'}${session.type}` as keyof IDailyStat
    const timeField = `time_${session.has_valid_cycle ? '' : 'nc_'}${session.type}` as keyof IDailyStat

    if (existingDayStat) {
      await this.dailyStats.update(existingDayStat.id!, {
        [counterField]: ((existingDayStat[counterField] as number) || 0) + 1,
        [timeField]: ((existingDayStat[timeField] as number) || 0) + duration,
      })
    } else {
      const newDayStat: IDailyStat = {
        date: startOfDay,
        focus: 0,
        short: 0,
        long: 0,
        nc_focus: 0,
        nc_short: 0,
        nc_long: 0,
        time_focus: 0,
        time_short: 0,
        time_long: 0,
        time_nc_focus: 0,
        time_nc_short: 0,
        time_nc_long: 0,
      }

      newDayStat[counterField] = 1
      newDayStat[timeField] = duration

      await this.dailyStats.add(newDayStat)
    }
  }
}

export type { ISession, IDailyStat as IPerDayStatistics }
export default HistoryDB
