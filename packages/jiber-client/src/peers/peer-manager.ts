import { Action, Store, OPEN, CLOSE } from 'jiber-core'
import { Peer } from './peer'

export class PeerManager {
  private dict: {[peerId: string]: Peer} = {}

  constructor (store: Store, stunServers: string[], maxPeers: number) {
    store.subscribe((_state: any, action: Action) => {
      const peerId = action.$uid
      if (!peerId || this.dict[peerId]) return
      if (Object.keys(this.dict).length >= maxPeers) return

      if (action.type === OPEN) {
        const peer = new Peer({ peerId, store, stunServers })
        this.dict[peerId] = peer
      }

      if (action.type === CLOSE) {
        this.removePeer(peerId)
      }
    })
  }

  private removePeer = (peerId: string) => {
    const peer = this.dict[peerId]
    if (peer) {
      peer.close()
      delete this.dict[peerId]
    }
  }

  private prunePeers = () => {
    const minTimeMs = new Date().getTime() - (60 * 1000)
    Object.keys(this.dict).forEach((peerId: string) => {
      const peer = this.dict[peerId]
      if (peer.lastReceivedAt < minTimeMs) this.removePeer(peerId)
    })
  }
}
