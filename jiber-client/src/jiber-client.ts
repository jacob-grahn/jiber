/**
 * A store holds sate, and provides an interface to dispatch packets that
 * act on that state
 */

import { Subscription } from './subscription'
import { Packet } from './packet'
import { Doc } from './doc'
import { ToughSocket } from './tough-socket'
import { Settings, CustomSettings } from './settings'

export class JiberClient {
  private settings: Settings
  public subscription: Subscription = new Subscription()
  private socket: ToughSocket

  constructor (customSettings: CustomSettings = {}) {
    this.settings = new Settings(customSettings)
    this.socket = new ToughSocket(this.settings)
    this.socket.onmessage = this.receive
  }

  send (packet: Packet): void {
    this.socket.send(JSON.stringify(packet))
  }

  receive (message: string): void {
    const packet: Packet = JSON.parse(message)
    this.subscription.publish(packet)
  }

  createDoc (docId: string): Doc {
    return new Doc(docId, this.settings)
  }
}
