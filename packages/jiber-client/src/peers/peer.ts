import { negotiateConnection } from './negotiate-connection'
import { PeerSettings } from './peer-settings'

export class Peer {
  private connection: RTCPeerConnection
  public lastReceivedAt: number

  constructor (settings: PeerSettings) {
    this.connection = this.createConnection(settings.stunServers)
    this.lastReceivedAt = new Date().getTime()
    negotiateConnection(this.connection, settings)
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
