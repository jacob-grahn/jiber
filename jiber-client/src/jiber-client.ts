/**
 * A store holds sate, and provides an interface to dispatch actions that
 * act on that state
 */

import { Subscription } from './subscription'
import { Action } from './action'
import { Doc } from './doc'
import { ToughSocket } from './tough-socket'
import { Settings, CustomSettings } from './settings'
import { Me } from './me'

export class JiberClient {
  public subscription: Subscription = new Subscription()
  private settings: Settings
  private socket: ToughSocket
  private docs: {[key: string]: Doc} = {}

  constructor (customSettings: CustomSettings = {}) {
    this.settings = new Settings(customSettings)
    this.socket = new ToughSocket(this.settings)
    this.socket.onmessage = this.receiveFromServer
    this.subscription.subscribe(this.welcomeListener)
  }

  public send = (action: {}): void => {
    this.socket.send(JSON.stringify(action))
  }

  public open = (docId: string): Doc => {
    const doc = this.docs[docId] || new Doc(docId, this.send, this.settings)
    this.docs[docId] = doc

    // forward received actions to the doc
    const forwardActions = (action: Action) => {
      if (!doc.open) {
        this.subscription.removeSubscriber(forwardActions)
      } else if (action.doc === docId) {
        doc.receiveFromServer(action)
      }
    }
    this.subscription.subscribe(forwardActions)

    return doc
  }

  public close = () => {
    this.socket.close()
    Object.keys(this.docs).forEach((key: string) => {
      this.docs[key].close()
    })
  }

  private welcomeListener = (action: Action) => {
    if (action.type === 'WELCOME') {
      Object.assign(Me, action.user)
    }
  }

  private receiveFromServer = (event: MessageEvent): void => {
    const message = event.data
    const action: Action = JSON.parse(message)
    this.subscription.publish(action)
  }
}
