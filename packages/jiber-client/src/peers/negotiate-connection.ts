import { WEBRTC_OFFER, WEBRTC_ANSWER, Action } from 'jiber-core'
import { Doc } from '../store/doc'

export interface NegotiateSettings {
  connection: RTCPeerConnection,
  offer: any,
  peerId: string,
  doc: Doc
}

export const negotiateConnection = async (settings: NegotiateSettings) => {
  if (settings.offer) {
    await negotiateAsReceiver(settings)
  } else {
    await negotiateAsSender(settings)
  }
}

const negotiateAsReceiver = async (settings: NegotiateSettings) => {
  const { connection, offer, peerId, doc } = settings
  await connection.setRemoteDescription(offer)
  const answer = await connection.createAnswer()
  await connection.setLocalDescription(answer)
  doc.dispatch({ type: WEBRTC_ANSWER, answer, peerId })
}

const negotiateAsSender = async (settings: NegotiateSettings) => {
  const { connection, peerId, doc } = settings
  const offer = await connection.createOffer()
  await connection.setLocalDescription(offer)
  doc.dispatch({ type: WEBRTC_OFFER, offer, peerId })
  const answer = await listenForAnswer(settings)
  await connection.setRemoteDescription(answer)
}

const listenForAnswer = (settings: NegotiateSettings): Promise<RTCSessionDescription> => {
  return new Promise((resolve) => {
    const { doc, peerId } = settings
    const unsubscribe = doc.subscribe((_state: any, action: Action) => {
      const { type, $uid } = action
      if (type === WEBRTC_ANSWER && $uid === peerId) {
        unsubscribe()
        resolve(action.answer)
      }
    })
  })
}
