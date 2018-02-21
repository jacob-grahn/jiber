import { WEBRTC_OFFER, WEBRTC_ANSWER, Action } from 'jiber-core'
import { PeerSettings } from './peer-settings'

export const negotiateConnection = async (connection: RTCPeerConnection, settings: PeerSettings) => {
  if (settings.offer) {
    await negotiateAsReceiver(connection, settings)
  } else {
    await negotiateAsSender(connection, settings)
  }
}

const negotiateAsReceiver = async (connection: RTCPeerConnection, settings: PeerSettings) => {
  const { offer, peerId, docId, store } = settings
  await connection.setRemoteDescription(offer)
  const answer = await connection.createAnswer()
  await connection.setLocalDescription(answer)
  store.dispatch({ type: WEBRTC_ANSWER, answer, peerId, $doc: docId })
}

const negotiateAsSender = async (connection: RTCPeerConnection, settings: PeerSettings) => {
  const { peerId, docId, store } = settings
  const offer = await connection.createOffer()
  await connection.setLocalDescription(offer)
  store.dispatch({ type: WEBRTC_OFFER, offer, peerId, $doc: docId })
  const answer = await listenForAnswer(settings)
  await connection.setRemoteDescription(answer)
}

const listenForAnswer = (settings: PeerSettings): Promise<RTCSessionDescription> => {
  return new Promise((resolve) => {
    const { store, peerId, docId } = settings
    const unsubscribe = store.subscribe((_state: any, action: Action) => {
      const { type, $uid, $doc } = action
      if (type === WEBRTC_ANSWER && $uid === peerId && $doc === docId) {
        unsubscribe()
        resolve(action.answer)
      }
    })
  })
}
