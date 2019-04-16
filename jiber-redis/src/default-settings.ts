import { JiberRedisSettings } from './interfaces'

export const defaultSettings: JiberRedisSettings = {
  host: '127.0.0.1',
  port: 6379,
  maxHistory: 1000,
  docId: 'defaultDocId'
}
