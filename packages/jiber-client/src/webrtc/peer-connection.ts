// todo: createOffer() and createAnswer()
// todo: when to close connections?
// todo: set a maximum number of connections
// todo: I have no idea what I am doing
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
import { createChannel } from './channel'
import { errorHandler } from '../utils/error-handler'

export type PeerConnection = {
  userId: string,
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
  userId: string,
  store: Store,
  settings: ClientSettings,
  isInitiator: boolean = false
): PeerConnection => {
  // pc is short for peerConnection
  const pc = createPC(settings.stunServers)
  const channel = createChannel(pc, isInitiator)

  channel.onmessage = (event: MessageEvent) => {
    console.log('channel.onmessage', event.data)
    const action: Action = JSON.parse(event.data)
    const roomId = action.$roomId
    if (!roomId) return
    const room = store.getState().rooms[roomId]
    const members = room.members
    const user = members[userId]
    if (!user) return

    action.$timeMs = new Date().getTime()
    action.$userId = userId
    action.$user = user
    store.dispatch(action)
  }

  const sendOffer = async (): Promise<void> => {
    const offer = await pc.createOffer()
    store.dispatch({type: WEBRTC_OFFER, offer, toUserId: userId})
    return pc.setLocalDescription(offer)
  }

  const sendAnswer = async (): Promise<void> => {
    const answer = await pc.createAnswer()
    store.dispatch({type: WEBRTC_ANSWER, answer, toUserId: userId})
    return pc.setLocalDescription(answer)
  }

  const sendCandidate = (candidate: RTCIceCandidate): void => {
    store.dispatch({type: WEBRTC_CANDIDATE, candidate, toUserId: userId})
  }

  const onConfirmedAction = async (action: Action): Promise<void> => {
    if (action.$userId !== userId) return
    switch (action.type) {
      case WEBRTC_OFFER:
        await pc.setRemoteDescription(action.offer)
        await sendAnswer()
        break
      case WEBRTC_ANSWER:
        await pc.setRemoteDescription(action.answer)
        break
      case WEBRTC_CANDIDATE:
        await pc.addIceCandidate(action.candidate)
        break
    }
  }

  const onOptimisticAction = (action: Action): void => {
    if (!action.$roomId) return
    const state = store.getState()
    if (action.$userId !== state.me.userId) return
    const room = state.rooms[action.$roomId]
    const members = room.members
    const memberIds = Object.keys(members)
    if (memberIds.indexOf(userId) !== -1) {
      channel.send(action)
    }
  }

  const onAction = async (action: Action): Promise<void> => {
    if (action.$confirmed) {
      await onConfirmedAction(action)
    } else {
      onOptimisticAction(action)
    }
  }

  pc.onicecandidate = (event) => {
    if (!event.candidate) return
    sendCandidate(event.candidate)
  }

  const connection: PeerConnection = {
    onAction,
    userId,
    close: pc.close
  }

  if (isInitiator) {
    sendOffer().catch(errorHandler)
  }

  return connection
}
