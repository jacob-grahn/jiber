import { Action, Store, OPEN, CLOSE, WEBRTC_OFFER } from 'jiber-core'
import { Peer } from './peer'

export interface PeerSettings {
  store: Store,
  stunServers: string[],
  maxPeers: number
}

export class PeerManager {
  private dict: {[peerId: string]: Peer} = {}
  private settings: PeerSettings

  constructor (settings: PeerSettings) {
    this.settings = settings
    settings.store.subscribe(this.onLocalAction)
  }

  private onLocalAction = (_state: any, action: Action) => {
    const { store, stunServers, maxPeers } = this.settings
    const peerId = action.$uid
    if (!peerId) return

    // invite new people to become peers
    if (action.type === OPEN || action.type === WEBRTC_OFFER) {

      // close unused peer connections to maybe make room for a new one
      this.prunePeers()

      // don't make the same peer connection twice
      if (this.dict[peerId]) return

      // don't exceed the maximum number of allowed peers
      if (Object.keys(this.dict).length >= maxPeers) return

      // create a new peer connection
      const { offer } = action
      const peer = new Peer({ peerId, store, stunServers, offer })
      this.dict[peerId] = peer
    }

    // remove disconnected peers
    if (action.type === CLOSE) {
      this.removePeer(peerId)
    }
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
