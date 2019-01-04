/**
 * Send incoming actions to redis stream
 * Read actions from subscribed streams, and send them on to next()
 */

import * as redis from 'redis'
import { promisify } from 'util'

export interface JiberRedisSettings {
  host?: string,
  port?: number,
  maxHistory: number
}

export const jiberRedis = (settings: JiberRedisSettings) => {
  const host = settings.host || '127.0.0.1'
  const port = settings.port || 6379
  const maxHistory = settings.maxHistory || 1000
  const readClient = redis.createClient({ host, port })
  const writeClient = redis.createClient({ host, port })
  const sendReadCommand = promisify(readClient.send_command).bind(readClient)
  const sendWriteCommand = promisify(writeClient.send_command).bind(writeClient)

  return (state: any) => (next: Function) => {
    state.lastEntryIds = {}

    const fetch = async () => {
      const docIds = Object.keys(state.subscriptions)
      const ids = docIds.map(docId => state.lastEntryIds[docId] || '$')
      const results: any = await sendReadCommand(
        'XREAD',
        ['BLOCK', '5000', 'STREAMS', ...docIds, ...ids],
        undefined
      )
      results.forEach((result: any) => {
        const strAction = result.action
        const entryId = result.entryId
        const docId = result.stream
        const action = JSON.parse(strAction)
        state.lastEntryIds[docId] = entryId
        next(action)
      })
      fetch().catch(console.log)
    }
    fetch().catch(console.log)

    return async (action: any) => {
      const stream = action.$docId
      const strAction = JSON.stringify(action)
      await sendWriteCommand(
        'XADD',
        [stream, 'MAXLEN', '~', maxHistory, '*', 'action', strAction],
        undefined
      )
    }
  }
}
