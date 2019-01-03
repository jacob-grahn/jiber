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
  public subscription: Subscription = new Subscription()
  private settings: Settings
  private socket: ToughSocket

  constructor (customSettings: CustomSettings = {}) {
    this.settings = new Settings(customSettings)
    this.socket = new ToughSocket(this.settings)
    this.socket.onmessage = this.receiveFromServer
  }

  public send = (packet: Packet): void => {
    this.socket.send(JSON.stringify(packet))
  }

  private receiveFromServer = (message: string): void => {
    const packet: Packet = JSON.parse(message)
    this.subscription.publish(packet)
  }

  public createDoc = (docId: string): Doc => {
    const doc = new Doc(docId, this.send, this.settings)

    // forward received packets to the doc
    const forwardPackets = (packet: Packet) => {
      if (!doc.open) {
        this.subscription.removeSubscriber(forwardPackets)
      } else if (packet.doc === docId) {
        doc.receiveFromServer(packet)
      }
    }
    this.subscription.subscribe(forwardPackets)

    return doc
  }
}
