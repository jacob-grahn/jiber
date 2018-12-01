import { Packet } from './packet'

export class History {

  private arr: Packet[] = []
  private dict: { [key: string]: Packet } = {}

  add (packet: Packet) {
    if (this.dict[packet.id]) {
      if ((this.dict[packet.id].trust) < (packet.trust)) {
        Object.assign(this.dict[packet.id], packet)
      }
    }
    else {
      this.dict[packet.id] = packet
      this.arr.push(packet)
    }
    this.arr.sort((a, b) => a.time - b.time)
  }

  from (time: number) {
    return this.arr.filter(packet => packet.time >= time)
  }
}
