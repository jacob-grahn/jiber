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
  private docs: {[key: string]: Doc} = {}

  constructor (customSettings: CustomSettings = {}) {
    this.settings = new Settings(customSettings)
    this.socket = new ToughSocket(this.settings)
    this.socket.onmessage = this.receiveFromServer
  }

  public send = (packet: Packet): void => {
    this.socket.send(JSON.stringify(packet))
  }

  public createDoc = (docId: string): Doc => {
    const doc = this.docs[docId] || new Doc(docId, this.send, this.settings)
    this.docs[docId] = doc

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

  public close = () => {
    this.socket.close()
    Object.keys(this.docs).forEach((key: string) => {
      this.docs[key].close()
    })
  }

  private receiveFromServer = (event: MessageEvent): void => {
    const message = event.data
    const packet: Packet = JSON.parse(message)
    this.subscription.publish(packet)
  }
}
