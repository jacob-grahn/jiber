/**
 * A store holds sate, and provides an interface to dispatch packets that
 * act on that state
 */

import { Subscription } from './subscription'
import { Packet } from './packet'
import { Doc } from './doc'
import { ToughSocket } from './tough-socket'
import { Settings, CustomSettings } from './settings'
import { CLOSE } from './constants'

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
    const doc = new Doc(docId, this.settings)

    // forward received packets to the doc
    this.subscription.subscribe(doc.receive)

    // send packets from the doc to the server
    const unsub = doc.sendSub.subscribe((packet: Packet) => {
      this.send(packet)

      // stop sending and receiving packets from doc if CLOSE is sent
      if (packet.payload === CLOSE) {
        unsub()
        this.subscription.removeSubscriber(doc.receive)
      }
    })

    return doc
  }
}
