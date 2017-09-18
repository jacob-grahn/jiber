import { DB, Action, RoomState, ACTION_PUSHED } from 'jiber-core'
import * as EventEmitter from 'events'
import * as Redis from 'redis'

export const createDb = (options: Redis.ClientOpts) => {
  const client = Redis.createClient(options)
  const pub = Redis.createClient(options)
  const sub = Redis.createClient(options)
  const emitter = new EventEmitter()
  let lastActionTime = 0

  sub.subscribe('channel1')

  sub.on('message', (_channel, message) => {
    const action = JSON.parse(message)
    if (action.$timeMs <= lastActionTime) {
      action.$timeMs = lastActionTime + 1
    }
    lastActionTime = action.$timeMs
    emitter.emit(ACTION_PUSHED, action)
  })

  const pushAction = (action: Action) => {
    action.$timeMs = new Date().getTime()
    pub.publish('channel1', JSON.stringify(action))
  }

  const fetchState = (roomId: string): Promise<RoomState> => {
    return new Promise((resolve, reject) => {
      client.get(roomId, (err, reply) => {
        if (err) reject(err)
        resolve(JSON.parse(reply))
      })
    })
  }

  const stashState = (roomId: string, room: RoomState): void => {
    client.set(roomId, JSON.stringify(room))
  }

  const redisDb: DB = {
    emitter,
    pushAction,
    fetchState,
    stashState
  }

  return redisDb
}
