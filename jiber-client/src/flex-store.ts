import { Packet } from './packet'
import { Reducer } from './interfaces'
import { SERVER, SELF, PEER } from './constants'

export class FlexStore {

  private reducer: Reducer
  private state: any
  private untrusted: Packet[] = []
  private recentConfirmed: {[key: string]: number} = {}
  private cleanInterval: number = 5000
  private lastClean: number = 0

  constructor (reducer: Reducer, state: any = undefined) {
    this.reducer = reducer
    this.state = state
  }

  public receive = (packet: Packet) => {
    // trusted updates from the server
    if (packet.trust === SERVER) {
      this.recentConfirmed[packet.id] = Date.now()
      this.state = this.reducer(this.state, packet.payload)
      this.untrusted = this.untrusted.filter(p => p.id !== packet.id)
      this.clean()
    } else {

      // don't add this packet if a confirmed version of it already exists
      // (this optimistic update is too late)
      if (this.recentConfirmed[packet.id]) return

      // add optimistic
      this.untrusted.push(packet)
    }
  }

  public getState = (trust: number = SELF) => {
    if (trust === SERVER) {
      return this.state
    } else if (trust === SELF) {
      const selfPackets = this.untrusted.filter(p => p.trust === SELF)
      return this.fastForward(this.state, selfPackets)
    } else if (trust === PEER) {
      return this.fastForward(this.state, this.untrusted)
    }
  }

  private clean = () => {
    const now = Date.now()
    if (now - this.lastClean < this.cleanInterval) return
    this.lastClean = now
    const minTime = now - this.cleanInterval
    this.untrusted = this.untrusted.filter(p => p.time <= minTime)
    Object.keys(this.recentConfirmed).forEach(key => {
      const time = this.recentConfirmed[key]
      if (time < minTime) delete this.recentConfirmed[key]
    })
  }

  private fastForward = (state: any, packets: Packet[]) => {
    packets.forEach(packet => {
      state = this.reducer(state, packet.payload)
    })
    return state
  }
}
