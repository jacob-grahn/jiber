// todo: createOffer() and createAnswer()
// todo: create middleware to pass events to webrtc
// todo: get typescript to stop complaining about createDataChannel
// todo: when to close connections?
// todo: set a maximum number of connections
// todo: I have no idea what I am doing
// todo: send offer when a new user joins a room
// https://shanetully.com/2014/09/a-dead-simple-webrtc-example/
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
import {
  Store,
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
} from 'jiber-core'
import { ClientSettings } from '../interfaces/client-settings'

const $roomId = 'peer-exchange'

export type PeerConnection = {
  userId: string,
  onAction: (action: Action) => void,
  close: Function,
  sendOffer: Function
}

const createPC = (stunServers: string[]) => {
  const config: RTCConfiguration = {
    iceServers: stunServers.map(url => ({urls: url}))
  }
  return new RTCPeerConnection(config)
}

const setupChannel = (pc: RTCPeerConnection) => {
  console.log('setupChannel', pc)
  const channelConfig: any = {
    ordered: false,
    negotiated: true,
    maxRetransmits: 0
  }
  const channel = (pc as any).createDataChannel('testChannel', channelConfig)

  channel.onerror = (error: any) => {
    console.log('channel.onerror', error)
  }

  channel.onmessage = (event: MessageEvent) => {
    console.log('channel.onmessage', event.data)
  }

  channel.onopen = () => {
    console.log('channel.onopen')
    channel.send('Hello World!')
  }

  channel.onclose = () => {
    console.log('channel.onclonse')
  }
}

export const createPeerConnection = (
  userId: string,
  store: Store,
  settings: ClientSettings
): PeerConnection => {
  // pc is short for peerConnection
  const pc = createPC(settings.stunServers)
  setupChannel(pc)

  const sendOffer = (): void => {
    pc.createOffer()
    .then((offer: RTCSessionDescription) => {
      store.dispatch({
        type: WEBRTC_OFFER,
        offer,
        $roomId,
        toUserId: userId
      })
      return pc.setLocalDescription(offer)
    })
    .catch(e => console.log('peer-connection::sendOffer', e))
  }

  const sendAnswer = (): void => {
    pc.createAnswer()
    .then((answer) => {
      store.dispatch({
        type: WEBRTC_ANSWER,
        answer,
        $roomId,
        toUserId: userId
      })
      return pc.setLocalDescription(answer)
    })
    .catch(e => console.log('peer-connection::sendAnswer', e))
  }

  const sendCandidate = (candidate: RTCIceCandidate): void => {
    store.dispatch({
      type: WEBRTC_CANDIDATE,
      candidate,
      $roomId,
      toUserId: userId
    })
  }

  const onAction = (action: Action): void => {
    if (!action.$confirmed) return
    if (action.$userId !== userId) return
    switch (action.type) {
      case WEBRTC_OFFER:
        pc.setRemoteDescription(action.offer).then(sendAnswer)
        .catch(e => console.log('peer-connection::onAction', action, e))
        break
      case WEBRTC_ANSWER:
        pc.setRemoteDescription(action.answer)
        .catch(e => console.log('peer-connection::onAction', action, e))
        break
      case WEBRTC_CANDIDATE:
        pc.addIceCandidate(action.candidate)
        .catch(e => console.log('peer-connection::onAction', action, e))
        break
    }
  }

  pc.onicecandidate = (event) => {
    if (!event.candidate) return
    sendCandidate(event.candidate)
  }

  const connection: PeerConnection = {
    onAction,
    userId,
    close: pc.close,
    sendOffer
  }

  return connection
}
