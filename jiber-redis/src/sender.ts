import { JiberRedisSettings, JiberRedisInput } from './interfaces'
import { getConnection } from './get-connection'
import { defaultSettings } from './default-settings'

export class Sender {
  private host: string
  private port: number
  private docId: string
  private maxHistory: number

  constructor (input: JiberRedisInput) {
    const settings: JiberRedisSettings = { ...defaultSettings, ...input }
    const { host, port, docId, maxHistory } = settings
    this.host = host
    this.port = port
    this.docId = docId
    this.maxHistory = maxHistory
  }

  public send = async (action: any) => {
    if (!this.docId) return
    const conn = getConnection(this.host, this.port, 'sender')
    const strAction = JSON.stringify(action)
    const result = await conn.xadd(
      this.docId, 'MAXLEN', '~', this.maxHistory, '*', 'action', strAction
    )
    return result
  }
}
