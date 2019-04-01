/**
 * Send incoming actions to redis stream
 * Read actions from subscribed streams, and send them on to next()
 */

import { Sender } from './sender'
import { Receiver } from './receiver'

export interface JiberRedisInput {
  host?: string,
  port?: number,
  maxHistory?: number,
  docId?: string
}

export interface JiberRedisSettings {
  host: string,
  port: number,
  maxHistory: number,
  docId: string
}

const defaultSettings: JiberRedisSettings = {
  host: '127.0.0.1',
  port: 6379,
  maxHistory: 1000,
  docId: 'defaultDocId'
}

export const jiberRedis = (input: JiberRedisInput) => (_state: any) => (next: Function) => {
  const settings = { ...defaultSettings, ...input }
  const sender = new Sender(settings)
  const receiver = new Receiver(settings, next)
  receiver.start()

  return (action: any) => {
    sender.send(action)
  }
}
