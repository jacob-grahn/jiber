// todo: when to close connections?
// todo: set a maximum number of connections
// todo: I have no idea what I am doing
// https://shanetully.com/2014/09/a-dead-simple-webrtc-example/
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
import { Store, Action } from 'jiber-core'
import { ClientSettings } from '../interfaces/client-settings'
import { createChannel } from './channel'
import { createReceiver } from './receiver'
import { createSender } from './sender'
import { createNegotiator } from './negotiator'
import { errorHandler } from '../utils/error-handler'

export type PeerConnection = {
  peerUserId: string,
  onAction: (action: Action) => void,
  close: Function
}

const createPC = (stunServers: string[]) => {
  const config: RTCConfiguration = {
    iceServers: stunServers.map(url => ({urls: url}))
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

  const onAction = (action: Action): void => {
    negotiator.onAction(action).catch(errorHandler)
    sender.onAction(action)
  }

  const connection: PeerConnection = {
    onAction,
    peerUserId,
    close: pc.close
  }

  return connection
}
