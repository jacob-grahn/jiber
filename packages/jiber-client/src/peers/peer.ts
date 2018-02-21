import { negotiateConnection } from './negotiate-connection'
import { exchangeCandidates } from './exchange-candidates'
import { PeerSettings } from './peer-settings'

export class Peer {
  private connection: RTCPeerConnection
  public lastReceivedAt: number

  constructor (settings: PeerSettings) {
    this.connection = this.createConnection(settings.stunServers)
    this.lastReceivedAt = new Date().getTime()
    exchangeCandidates(this.connection, settings)
    this.setupConnection(settings).catch(console.log)
  }

  private createConnection = (stunServers: string[]) => {
    return new RTCPeerConnection({
      iceServers: stunServers.map(url => ({ urls: url }))
    })
  }

  private setupConnection = async (settings: PeerSettings) => {
    await negotiateConnection(this.connection, settings)
  }

  public close = () => {
    this.connection.close()
  }
}
