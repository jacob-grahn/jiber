import { OPEN, CLOSE, SELF } from './constants'
import { Subscription } from './subscription'
import { toDispatchers } from './to-dispatchers'
import { Action } from './action'
import { Settings } from './settings'
import { FlexStore } from './flex-store'
import { PeerGroup } from './webrtc'
import { Me } from './me'

/**
 * Doc the users can join
 */
export class Doc {
  public subscription: Subscription = new Subscription()
  public getState: FlexStore['getState']
  public dispatchers: { [key: string]: Function }
  public open: boolean = true
  public subscribe: Function = this.subscription.subscribe
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
    this.sendToServer(new Action({ doc: this.id, type: OPEN }))
  }

  public receiveFromServer = (action: Action): void => {
    if (!action.type) return
    if (action.type.indexOf('WEBRTC_') === 0) {
      this.peerGroup.receiveFromServer(action)
    } else {
      this.sendToStore(action)
    }
  }

  public sendToStore = (action: Action): void => {
    this.store.receive(action)
    this.subscription.publish(this.store.getState(), action)
  }

  public dispatch = (obj: any): void => {
    const action = new Action({ ...obj, doc: this.id, trust: SELF })
    this.peerGroup.send(action)
    this.sendToServer(action)
    this.sendToStore({...action, user: Me})
  }

  public close = (): void => {
    this.peerGroup.close()
    this.sendToServer(new Action({ type: CLOSE, doc: this.id }))
    this.open = false
  }
}
