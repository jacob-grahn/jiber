import { DB, Action } from 'jiber-core'
import * as Redis from 'redis'

export const createDb = (options: Redis.ClientOpts) => {
  const client = Redis.createClient(options)
  const pub = Redis.createClient(options)
  const sub = Redis.createClient(options)
  let lastActionTime = 0

  sub.subscribe('channel1')

  const pushAction = (action: Action) => {
    action.$timeMs = new Date().getTime()
    pub.publish('channel1', JSON.stringify(action))
  }

  const fetchState = (roomId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      client.get(roomId, (err, reply) => {
        if (err) reject(err)
        resolve(JSON.parse(reply))
      })
    })
  }

  const stashState = (roomId: string, room: any): void => {
    client.set(roomId, JSON.stringify(room))
  }

  const redisDb: DB = {
    pushAction,
    fetchState,
    stashState
  }

  sub.on('message', (_channel, message) => {
    const action = JSON.parse(message)
    if (action.$timeMs <= lastActionTime) {
      action.$timeMs = lastActionTime + 1
    }
    lastActionTime = action.$timeMs
    if (redisDb.onaction) redisDb.onaction(action)
  })

  return redisDb
}
