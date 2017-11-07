import { Store, Action } from 'jiber-core'
import { ClientSettings } from '../interfaces/client-settings'
import { createChannel } from './channel'
import { shouldPeer } from './should-peer'
import { createNegotiator } from './negotiator'
import { onPeerMessage } from './on-peer-message'
import { errorHandler } from '../utils/error-handler'

export type Peer = {
  peerUserId: string,
  close: Function
}

const createPC = (stunServers: string[]) => {
  const config: RTCConfiguration = {
    iceServers: stunServers.map(url => ({ urls: url }))
  }
  return new RTCPeerConnection(config)
}

export const createPeer = (
  peerUserId: string,
  store: Store,
  settings: ClientSettings,
  offer: any
): Peer => {

  // pc is short for peerConnection
  const pc = createPC(settings.stunServers)
  const channel = createChannel(pc, !offer)
  const negotiator = createNegotiator(
    store.dispatch,
    pc,
    peerUserId,
    offer
  )

  channel.onmessage = (message: MessageEvent) => {
    onPeerMessage(store, peerUserId, message)
  }

  const unsubscribe = store.subscribe((action: Action): void => {
    negotiator.onAction(action).catch(errorHandler)
    const state = store.getState()
    if (shouldPeer(state, peerUserId, action)) channel.send(action)
  })

  const close = () => {
    unsubscribe()
    pc.close()
  }

  return {
    peerUserId,
    close
  }
}
