import { Packet } from './packet'
import { Reducer } from './interfaces'
import { SERVER, SELF, PEER } from './constants'

export class FlexStore {

  private reducer: Reducer
  private state: any
  private untrusted: Packet[] = []

  constructor (reducer: Reducer, state: any = undefined) {
    this.reducer = reducer
    this.state = state
  }

  public receive = (packet: Packet) => {
    if (packet.trust === SERVER) {
      console.log('flex-store trusted packet', packet)
      this.state = this.reducer(this.state, packet.payload)
      this.untrusted = this.untrusted.filter(p => p.id !== packet.id)
    } else {
      this.untrusted.push(packet)
    }

    // this.untrusted = this.untrusted.filter(p => p.time <= packet.time - 3000)
  }

  public getState = (trust: number = SELF) => {
    // console.log('flex-store getState')
    // console.log({state: this.state, untrusted: this.untrusted, optimistic: this.fastForward(this.state, this.untrusted)})
    if (trust === SERVER) {
      return this.state
    } else if (trust === SELF) {
      const selfPackets = this.untrusted.filter(p => p.trust === SELF)
      return this.fastForward(this.state, selfPackets)
    } else if (trust === PEER) {
      return this.fastForward(this.state, this.untrusted)
    }
  }

  private fastForward = (state: any, packets: Packet[]) => {
    packets.forEach(packet => {
      state = this.reducer(state, packet.payload)
    })
    return state
  }
}
