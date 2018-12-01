import { Packet } from '../store/packet'

export interface Reducer {
  (state: any, packet: Packet): any
}
