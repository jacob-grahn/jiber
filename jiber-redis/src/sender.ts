import { JiberRedisSettings } from './interfaces'
import { getConnection } from './get-connection'

export class Sender {
  private host: string
  private port: number
  private docId: string

  constructor (settings: JiberRedisSettings) {
    const { host, port, docId } = settings
    this.host = host
    this.port = port
    this.docId = docId
  }

  public send = async (action: any) => {
    const conn = getConnection(this.host, this.port, 'sender')
    const strAction = JSON.stringify(action)
    const result = await conn.xadd(
      this.docId, '*', 'action', strAction
    )
    return result
  }
}
