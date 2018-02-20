import { Store } from 'jiber-core'
import { ClientSettings } from '../interfaces'

export interface PeerSettings {
  peerId: string,
  store: Store,
  stunServers: ClientSettings['stunServers'],
  offer?: any
}

export class Peer {
  private connection: RTCPeerConnection
  public lastReceivedAt: number

  constructor (settings: PeerSettings) {
    this.connection = this.createConnection(settings.stunServers)
    this.lastReceivedAt = new Date().getTime()
  }

  private createConnection = (stunServers: string[]) => {
    return new RTCPeerConnection({
      iceServers: stunServers.map(url => ({ urls: url }))
    })
  }

  public close = () => {
    this.connection.close()
  }
}
