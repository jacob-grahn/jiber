import { Store, Action } from 'jiber-core'
import { ClientSettings } from '../interfaces/client-settings'
import { Channel } from './channel'
import { shouldPeer } from './should-peer'
import { Negotiator } from './negotiator'
import { onPeerMessage } from './on-peer-message'
import { errorHandler } from '../utils/error-handler'

/**
 * A direct p2p connection to another user
 * @hidden
 */
export class Peer {
  private peerConnection: RTCPeerConnection
  private unsubscribe: Function

  constructor (
    peerUserId: string,
    store: Store,
    settings: ClientSettings,
    offer?: any
  ) {
    // create peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: settings.stunServers.map(url => ({ urls: url }))
    })

    // add a data channel to the peer connection
    const channel = new Channel(
      this.peerConnection,
      !offer,
      onPeerMessage(store, peerUserId)
    )

    // negotiate offers until the connection is formed
    const negotiator = new Negotiator(
      store.dispatch,
      this.peerConnection,
      peerUserId,
      offer
    )

    // sometimes we just need to stop the madness
    this.unsubscribe = store.subscribe((state: any, action: Action): void => {
      negotiator.onAction(action).catch(errorHandler)
      if (shouldPeer(state, peerUserId, action)) channel.send(action)
    })
  }

  public close () {
    this.unsubscribe()
    this.peerConnection.close()
  }
}
