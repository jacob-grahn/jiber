import { HiDBRedisSettings } from './interfaces'
import { getConnection } from './get-connection'

export class StateSaver {

  private host: string
  private port: number
  private maxHistory: number
  private docId: string
  private count: number = 0

  constructor (settings: HiDBRedisSettings) {
    const { host, port, maxHistory, docId } = settings
    this.host = host
    this.port = port
    this.maxHistory = maxHistory
    this.docId = docId
  }

  public onAction = (server: any, action: any) => {
    this.count++
    if (this.count > (this.maxHistory / 2)) {
      this.count = 0
      const conn = getConnection(this.host, this.port, 'sender')
      const doc = server.getDoc(this.docId)
      const packed = { state: doc.state, time: action.time }
      conn.set(`state-${this.docId}`, JSON.stringify(packed))
        .catch(console.log)
    }
  }
}
