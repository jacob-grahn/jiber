import { JiberRedisSettings } from './interfaces'
import { Sender } from './sender'
import { Receiver } from './receiver'
import { StateSaver } from './state-saver'

export class DocWorker {

  private sender: Sender
  private receiver: Receiver
  private stateSaver: StateSaver
  private next: Function
  private server: any

  constructor (settings: JiberRedisSettings, server: any, next: Function) {
    this.sender = new Sender(settings)
    this.receiver = new Receiver(settings, this.onActionFromRedis)
    this.stateSaver = new StateSaver(settings)
    this.next = next
    this.server = server
    this.receiver.start()
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
    this.receiver.stop()
  }
}
