import { Action } from './interfaces'
import { OPEN, CLOSE, SELF } from './constants'
import { Subscription } from './subscription'
import { toDispatchers } from './to-dispatchers'
import { Packet } from './packet'
import { Settings } from './settings'
import { FlexStore } from './flex-store'
import { PeerGroup } from './webrtc'

/**
 * Doc the users can join
 */
export class Doc {
  public subscription: Subscription = new Subscription()
  public getState: FlexStore['getState']
  public dispatchers: { [key: string]: Function }
  public open: boolean = true
  private sendToServer: Function
  private id: string
  private store: FlexStore
  private peerGroup: PeerGroup

  constructor (id: string, sendToServer: Function, settings: Settings) {
    this.id = id
    this.sendToServer = sendToServer
    this.store = new FlexStore(settings.reducer)
    this.getState = this.store.getState

    // p2p
    this.peerGroup = new PeerGroup(this.id, this.sendToServer, this.sendToStore)

    // action dispatchers
    this.dispatchers = toDispatchers(this.dispatch, settings.actionCreators)
    Object.assign(this, this.dispatchers)

    // start receiving updates from this room
    this.sendToServer(new Packet({ doc: this.id, payload: OPEN }))
  }

  public receiveFromServer = (packet: Packet): void => {
    this.peerGroup.receiveFromServer(packet)
    this.sendToStore(packet)
  }

  public sendToStore = (packet: Packet): void => {
    this.store.receive(packet)
    this.subscription.publish(this.store.getState(), packet.payload)
  }

  public dispatch = (payload: Action): void => {
    const packet = new Packet({ payload, doc: this.id, trust: SELF })
    this.sendToServer(packet)
    this.sendToStore(packet)
  }

  public close = (): void => {
    this.peerGroup.close()
    this.sendToServer(new Packet({ payload: CLOSE, doc: this.id }))
    this.open = false
  }
}
