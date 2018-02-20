import {
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  SERVER
} from 'jiber-core'
import { errorHandler } from '../utils/error-handler'

/**
 * Handle the initial negotiation needed to establish the peer connection
 * @hidden
 */
export class Negotiator {
  private peerConnection: RTCPeerConnection
  private dispatch: (action: Action) => void
  private peerUserId: string

  constructor (
    dispatch: (action: Action) => void,
    peerConnection: RTCPeerConnection,
    peerUserId: string,
    offer?: any
  ) {
    this.dispatch = dispatch
    this.peerConnection = peerConnection
    this.peerUserId = peerUserId

    if (offer) {
      this.acceptOffer(offer).catch(errorHandler)
    } else {
      this.sendOffer().catch(errorHandler)
    }

    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return
      this.sendCandidate(event.candidate)
    }
  }

  public onAction = async (action: Action): Promise<void> => {
    if (action.$src !== SERVER) return
    switch (action.type) {
      case WEBRTC_ANSWER:
        return this.peerConnection.setRemoteDescription(action.answer)
      case WEBRTC_CANDIDATE:
        return this.peerConnection.addIceCandidate(action.candidate)
    }
  }

  private acceptOffer = async (offer: any) => {
    await this.peerConnection.setRemoteDescription(offer)
    return this.sendAnswer()
  }

  private sendAnswer = async (): Promise<void> => {
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)
    this.dispatch({ type: WEBRTC_ANSWER, answer, peerUserId: this.peerUserId })
  }

  private sendOffer = async (): Promise<void> => {
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    this.dispatch({ type: WEBRTC_OFFER, offer, peerUserId: this.peerUserId })
  }

  private sendCandidate = (candidate: RTCIceCandidate): void => {
    this.dispatch({ type: WEBRTC_CANDIDATE, candidate, peerUserId: this.peerUserId })
  }
}
