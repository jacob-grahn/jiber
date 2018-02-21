import { Action, WEBRTC_CANDIDATE } from 'jiber-core'
import { PeerSettings } from './peer-settings'

export const exchangeCandidates = async (connection: RTCPeerConnection, settings: PeerSettings) => {
  const { store, docId, peerId } = settings

  // send out candidates
  connection.onicecandidate = (event) => {
    if (!event.candidate) return
    const candidate: RTCIceCandidate = event.candidate
    store.dispatch({ type: WEBRTC_CANDIDATE, candidate, peerId, $doc: docId })
  }

  // listen for incoming candidates
  const unsubscribe = store.subscribe((_state: any, action: Action) => {
    if (action.type === WEBRTC_CANDIDATE && action.$doc === docId && action.$uid === peerId) {
      connection.addIceCandidate(action.candidate)
    }
  })

  // stop listening for candidates if the connection closes
  connection.oniceconnectionstatechange = () => {
    const state = connection.iceConnectionState
    if (state === 'failed' || state === 'disconnected' || state === 'closed') {
      unsubscribe()
    }
  }
}
