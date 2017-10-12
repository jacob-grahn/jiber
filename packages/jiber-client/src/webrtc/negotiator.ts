import {
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
} from 'jiber-core'
import { errorHandler } from '../utils/error-handler'

/**
 * Handle the initial negotiation needed to establish the peer connection
 */
export const createNegotiator = (
  dispatch: (action: Action) => void,
  pc: RTCPeerConnection,
  peerUserId: string,
  isInitiator: boolean = false
) => {

  const sendOffer = async (): Promise<void> => {
    const offer = await pc.createOffer()
    dispatch({type: WEBRTC_OFFER, offer, peerUserId})
    return pc.setLocalDescription(offer)
  }

  const sendAnswer = async (pc: RTCPeerConnection): Promise<void> => {
    const answer = await pc.createAnswer()
    dispatch({type: WEBRTC_ANSWER, answer, peerUserId})
    await pc.setLocalDescription(answer)
  }

  const sendCandidate = (candidate: RTCIceCandidate): void => {
    dispatch({type: WEBRTC_CANDIDATE, candidate, peerUserId})
  }

  const onAction = async (action: Action): Promise<void> => {
    if (!action.$confirmed) return
    if (action.$u !== peerUserId) return
    switch (action.type) {
      case WEBRTC_OFFER:
        await pc.setRemoteDescription(action.offer)
        return sendAnswer(pc)
      case WEBRTC_ANSWER:
        return pc.setRemoteDescription(action.answer)
      case WEBRTC_CANDIDATE:
        return pc.addIceCandidate(action.candidate)
    }
  }

  pc.onicecandidate = (event) => {
    if (!event.candidate) return
    sendCandidate(event.candidate)
  }

  if (isInitiator) {
    sendOffer().catch(errorHandler)
  }

  return {
    onAction
  }
}
