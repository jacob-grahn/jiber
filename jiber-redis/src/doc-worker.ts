import { JiberRedisSettings } from './interfaces'
import { Sender } from './sender'
import { Receiver } from './receiver'
import { StateSaver } from './state-saver'
import { getConnection } from './get-connection'

export class DocWorker {

  private sender: Sender
  private receiver: Receiver
  private stateSaver: StateSaver
  private next: Function
  private server: any
  private active: boolean = true

  constructor (settings: JiberRedisSettings, server: any, next: Function) {
    this.sender = new Sender(settings)
    this.receiver = new Receiver(settings, this.onActionFromRedis)
    this.stateSaver = new StateSaver(settings)
    this.next = next
    this.server = server
    this.fetchInitialState(settings.host, settings.port, settings.docId)
      .catch(err => console.log('dockerWorker.fetchInitialState', err))
  }

  private fetchInitialState = async (host: string, port: number, docId: string) => {
    const conn = getConnection(host, port, docId)
    const result = await conn.get(`state-${docId}`)
    if (!this.active) return
    if (result) {
      const { state, time } = result
      this.next({ type: 'SET', path: '', value: state, trust: 2, doc: docId })
      this.receiver.start(time.toString())
    } else {
      this.receiver.start()
    }
  }

  private onActionFromRedis = (action: any) => {
    this.stateSaver.onAction(this.server, action)
    this.next(action)
  }

  public send = (action: any) => {
    this.sender.send(action)
      .catch(() => setTimeout(() => this.sender.send(action), 5000))
  }

  public stop = () => {
    this.active = true
    this.receiver.stop()
  }
}
