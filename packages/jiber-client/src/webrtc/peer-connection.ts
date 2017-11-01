import { Store, Action } from 'jiber-core'
import { ClientSettings } from '../interfaces/client-settings'
import { createChannel } from './channel'
import { createReceiver } from './receiver'
import { createSender } from './sender'
import { createNegotiator } from './negotiator'
import { errorHandler } from '../utils/error-handler'

export type PeerConnection = {
  peerUserId: string,
  close: Function
}

const createPC = (stunServers: string[]) => {
  const config: RTCConfiguration = {
    iceServers: stunServers.map(url => ({ urls: url }))
  }
  return new RTCPeerConnection(config)
}

export const createPeerConnection = (
  peerUserId: string,
  store: Store,
  settings: ClientSettings,
  isInitiator: boolean = false
): PeerConnection => {

  // pc is short for peerConnection
  const pc = createPC(settings.stunServers)
  const receiver = createReceiver(store, peerUserId)
  const channel = createChannel(pc, isInitiator, receiver)
  const sender = createSender(store.getState, peerUserId, channel.send)
  const negotiator = createNegotiator(
    store.dispatch,
    pc,
    peerUserId,
    isInitiator
  )

  const unsubscribe = store.subscribe((action: Action): void => {
    negotiator.onAction(action).catch(errorHandler)
    sender.onAction(action)
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
