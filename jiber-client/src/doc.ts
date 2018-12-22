import { Action } from './interfaces'
import { OPEN, CLOSE, SELF } from './constants'
import { Subscription } from './subscription'
import { toDispatchers } from './to-dispatchers'
import { Packet } from './packet'
import { Settings } from './settings'
import { FlexStore } from './flex-store'

/**
 * Doc the users can join
 */
export class Doc {
  public sendSub: Subscription = new Subscription()
  public updateSub: Subscription = new Subscription()
  public getState: FlexStore['getState']
  public dispatchers: { [key: string]: Function }
  private id: string
  private store: FlexStore

  constructor (id: string, settings: Settings) {
    this.id = id
    this.store = new FlexStore(settings.reducer)
    this.getState = this.store.getState

    // action dispatchers
    this.dispatchers = toDispatchers(this.dispatch, settings.actionCreators)
    Object.assign(this, this.dispatchers)

    // start receiving updates from this room
    this.sendSub.publish(new Packet({ doc: this.id, payload: OPEN }))
  }

  public receive = (packet: Packet): void => {
    if (packet.doc === this.id) {
      this.store.receive(packet)
      this.updateSub.publish(this.store.getState(), packet.payload)
    }
  }

  public dispatch = (payload: Action): void => {
    const packet = new Packet({ payload, doc: this.id, trust: SELF })
    this.sendSub.publish(packet)
    this.receive(packet)
  }

  public close = (): void => {
    this.sendSub.publish(new Packet({ payload: CLOSE, doc: this.id }))
  }
}
