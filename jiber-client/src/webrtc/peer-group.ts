import { Packet } from '../packet'
import { WEBRTC_SOLICIT } from '../constants'
import { Peer } from './peer'

export class PeerGroup {

  private sendToServer: Function
  private sendToStore: Function
  private peers: { [key: string]: Peer } = {}

  constructor (docId: string, sendToServer: Function, sendToStore: Function) {
    this.sendToServer = sendToServer
    this.sendToStore = sendToStore
    this.sendToServer(new Packet({ doc: docId, payload: WEBRTC_SOLICIT }))
  }

  public receiveFromServer = (packet: Packet): void => {
    if (packet.type && packet.type.indexOf('WEBRTC_') === 0) {
      const peerId = packet.payload.peerId
      if (!this.peers[peerId]) {
        this.peers[peerId] = new Peer(
          peerId,
          this.sendToServer,
          this.sendToStore
        )
      }
      this.peers[peerId].receiveFromServer(packet).catch(console.log)
    }
  }

  public close = (): void => {
    Object.keys(this.peers).forEach(peerId => {
      this.peers[peerId].close()
      delete this.peers[peerId]
    })
  }
}
