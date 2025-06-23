import LongBreakInterval from './long-break-interval'
import SessionAudio from './session-audio'
import SessionShow from './session-show'
import type { Session } from './types'
import type React from 'react'

type SessionType = {
  name: string
  key: Session
  custom?: () => React.ReactNode
}

const sessionList: SessionType[] = [
  {
    name: 'Focus Session',
    key: 'focus',
  },
  {
    name: 'Short Break Session',
    key: 'short',
  },
  {
    name: 'Long Break Session',
    key: 'long',
    custom: LongBreakInterval,
  },
]

const PomodoroSession = () =>
  sessionList.map(({ name, key, custom: Custom }) => (
    <div key={key} className="space-y-2">
      <h3 className="text-lg font-bold">{name}</h3>
      <div className="border-input/80 rounded-lg border-2 py-5">
        <div className="space-y-4 px-5">
          {Custom && (
            <>
              <Custom />
              <hr />
            </>
          )}
          <SessionShow
            session={key}
            show="desktop"
            title="Show desktop notification"
            description={`Enable desktop notifications to alert you during the ${name.toLowerCase()}.`}
          />
          <hr />
          <SessionShow
            session={key}
            show="newTab"
            title="Show new tab notification"
            description={`Enable new tab notifications to alert you during the ${name.toLowerCase()}.`}
          />
          <hr />
          <SessionAudio
            session={key}
            title="Show audio"
            description={`Enable audio alerts for the ${name.toLowerCase()}.`}
          />
        </div>
      </div>
    </div>
  ))

export default PomodoroSession
