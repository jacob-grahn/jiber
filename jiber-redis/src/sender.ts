import { JiberRedisSettings } from './index'
import { getConnection } from './get-connection'

export class Sender {
  private host: string
  private port: number
  private maxHistory: number
  private docId: string

  constructor (settings: JiberRedisSettings) {
    const { host, port, maxHistory, docId } = settings
    this.host = host
    this.port = port
    this.maxHistory = maxHistory
    this.docId = docId
  }

  public send = (action: any) => {
    const conn = getConnection(this.host, this.port)
    const strAction = JSON.stringify(action)
    conn(
      'XADD',
      [this.docId, 'MAXLEN', '~', this.maxHistory, '*', 'action', strAction],
      undefined
    )
  }
}
