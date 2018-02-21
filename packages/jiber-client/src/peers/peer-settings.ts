import { Store } from 'jiber-core'

export interface PeerSettings {
  stunServers: string[],
  maxPeers: number,
  store: Store,
  docId: string,
  peerId: string,
  offer?: any
}
