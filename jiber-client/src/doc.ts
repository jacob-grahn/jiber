import { Action } from './interfaces'
import { OPEN, CLOSE } from './constants/action-types'
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
  private id: string
  private store: FlexStore

  constructor (id: string, settings: Settings) {
    this.id = id
    this.store = new FlexStore(settings.reducer)
    this.getState = this.store.getState

    // action dispatchers
    Object.assign(this, toDispatchers(this.dispatch, settings.actionCreators))

    // start receiving updates from this room
    this.sendSub.publish(new Packet({ doc: this.id, payload: OPEN }))
  }

  public receive (packet: Packet): void {
    if (packet.doc === this.id) {
      this.store.receive(packet)
      this.updateSub.publish(this.store.getState(), packet.payload)
    }
  }

  public dispatch (payload: Action) {
    const packet = new Packet({ payload, doc: this.id })
    this.sendSub.publish(packet)
    this.receive(packet)
  }

  public close () {
    this.sendSub.publish(new Packet({ payload: CLOSE, doc: this.id }))
  }
}
