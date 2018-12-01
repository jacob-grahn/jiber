import { History } from './history'
import { Snapshots } from './snapshots'
import { Packet } from './packet'

export class TimeyWimey {

  private history: History
  private snapshots: Snapshots

  constructor () {
    this.history = new History()
    this.snapshots = new Snapshots()
  }

  addPacket (packet: Packet) {
    this.history.add(packet)
    const snapshot = this.snapshots.retrieve(packet.time)
    const packets = this.history.from(snapshot.time + 0.1)
    if (packets.length === 0) packets.push(packet)
    return { state: snapshot.state, packets }
  }

  addSnapshot (state: any, time: number): void {
    this.snapshots.save(state, time)
    this.snapshots.prune(time - 5000)
  }
}
