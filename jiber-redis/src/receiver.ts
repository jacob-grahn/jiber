import { JiberRedisSettings } from './interfaces'
import { getConnection, RedisConnection } from './get-connection'

export class Receiver {
  private next: Function
  private lastActionTime: string = '0'
  private host: string
  private port: number
  private docId: string
  private active: boolean = false
  private pendingTimeout: NodeJS.Timeout | undefined
  private conn: RedisConnection | undefined

  constructor (settings: JiberRedisSettings, next: Function) {
    const { host, port, docId } = settings
    this.next = next
    this.host = host
    this.port = port
    this.docId = docId
  }

  public start = (lastActionTime: string = '0') => {
    this.lastActionTime = lastActionTime
    this.active = true
    this.fetchLoop()
  }

  public stop = () => {
    this.active = false
    if (this.pendingTimeout) {
      clearTimeout(this.pendingTimeout)
    }
    if (this.conn) {
      this.conn.close()
    }
  }

  private fetch = async () => {
    this.conn = getConnection(this.host, this.port, `${this.docId}-receiver`)
    const results: any = await this.conn.xread(
      'BLOCK', '1000', 'COUNT', '100', 'STREAMS', this.docId, this.lastActionTime
    )

    if (!this.active) return
    if (!results) return

    results.forEach((result: any) => {
      const actionPacks = result[1]

      actionPacks.forEach((actionPack: any) => {
        const entryId = actionPack[0]
        const strAction = actionPack[1][1]
        const action = JSON.parse(strAction)
        action.doc = this.docId
        action.time = Number(entryId.split('-')[0])
        this.lastActionTime = entryId
        this.next(action)
      })
    })
  }

  private fetchLoop = () => {
    if (!this.active) return
    this.fetch()
      .then(this.scheduleNextLoop)
      .catch(this.scheduleNextLoop)
  }

  private scheduleNextLoop = () => {
    if (!this.active) return
    this.pendingTimeout = setTimeout(this.fetchLoop, 100)
  }
}
