import { HiDBRedisSettings } from './interfaces'

export const defaultSettings: HiDBRedisSettings = {
  host: '127.0.0.1',
  port: 6379,
  maxHistory: 1000,
  docId: 'defaultDocId'
}
