import { JiberRedisSettings } from './index'
import { getConnection } from './get-connection'

export class Receiver {
  private next: Function
  private lastActionTime: string = '$'
  private host: string
  private port: number
  private docId: string
  private active: boolean = false

  constructor(settings: JiberRedisSettings, next: Function) {
    const { host, port, docId } = settings
    this.next = next
    this.host = host
    this.port = port
    this.docId = docId
  }

  public start = () => {
    this.active = true
    this.fetchLoop()
  }

  public stop = () => {
    this.active = false
  }

  private fetch = async () => {
    const send = getConnection(this.host, this.port)
    const results: any = await send(
      'XREAD',
      ['BLOCK', '5000', 'STREAMS', this.docId, this.lastActionTime],
      undefined
    )

    if (!this.active) return

    results.forEach((result: any) => {
      const strAction = result.action
      const entryId = result.entryId
      const docId = result.stream
      const action = JSON.parse(strAction)
      action.doc = docId
      action.time = entryId
      this.lastActionTime = entryId
      this.next(action)
    })
  }

  private fetchLoop = () => {
    if (!this.active) return
    this.fetch()
      .then(this.fetchLoop)
      .catch(this.fetchLoop)
  }
}
