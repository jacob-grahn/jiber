/**
 * A store holds sate, and provides an interface to dispatch packets that
 * act on that state
 */

import { Subscription } from './subscription'
import { Packet } from './packet'
import { Reducer } from '../interfaces/reducer'
import { swiss } from '../swiss'

interface JiberSettings {
  reducer?: Reducer,
  state?: any
}

export class Jiber {
  public subscribe: Function

  private reducer = swiss
  private state: any
  private subscription: Subscription = new Subscription()

  constructor (settings: JiberSettings) {
    Object.assign(this, settings)
    this.subscribe = this.subscription.subscribe
  }

  dispatch (packet: Packet): void {
    this.state = this.reducer(this.state, packet.payload)
    this.subscription.publish(this.state, packet.payload)
  }

  getState () {
    return this.state
  }
}
