import { Packet } from '../packet'
import { JiberServer } from '../jiber-server'
import { SERVER } from '../constants'

export const init = (_server: JiberServer) => (next: Function) => (packet: Packet) => {
  packet.trust = SERVER
  packet.time = Date.now()
  next(packet)
}
