import { Action } from '../interfaces'
import { OPEN, CLOSE } from '../constants/action-types'
import { Subscription } from './subscription'
import { toDispatchers } from './to-dispatchers'
import { Packet } from './packet'
import { Reducer } from '../interfaces'
import { Settings } from './settings'

/**
 * Doc the users can join
 * @hidden
 */
export class Doc {
  public sendSub: Subscription = new Subscription()
  public updateSub: Subscription = new Subscription()
  private id: string
  private state: any
  private reducer: Reducer

  constructor (id: string, settings: Settings) {
    this.id = id
    this.reducer = settings.reducer

    // action dispatchers
    Object.assign(this, toDispatchers(this.dispatch, settings.actionCreators))

    // start receiving updates from this room
    this.send(new Packet({ doc: this.id, payload: OPEN }))
  }

  private send (packet: Packet): void {
    this.sendSub.publish(packet)
  }

  public receive (packet: Packet): void {
    if (packet.doc === this.id) {
      this.updateSub.publish(this.state, packet.payload)
    }
  }

  public dispatch (payload: Action) {
    const packet = new Packet({ payload, doc: this.id })
    this.state = this.reducer(this.state, payload)
    this.updateSub.publish(this.state, packet.payload)
    this.sendSub.publish(packet)
  }

  public getState () {
    return this.state
  }

  public close () {
    this.send(new Packet({ payload: CLOSE, doc: this.id }))
  }
}
