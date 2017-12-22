import { Action } from 'jiber-core'

/**
 * P2P data channel
 * After a peer connection has been formed, this creates a data channel over
 * that connection
 * @hidden
 */
export class Channel {
  private channel: any

  constructor (
    peerConnection: any, // RTCPeerConnection, no types for this yet
    isInitiator: boolean,
    onmessage?: Function
  ) {
    if (isInitiator) {
      const channelConfig = { ordered: false, maxRetransmits: 0 }
      this.channel = peerConnection.createDataChannel('data', channelConfig)
      this.channel.onmessage = onmessage
    } else {
      peerConnection.ondatachannel = (event: any) => {
        this.channel = event.channel
        this.channel.onmessage = onmessage
      }
    }
  }

  public send (action: Action): void {
    if (this.channel && this.channel.readyState === 'open') {
      const smallerAction = {
        ...action,
        ...{ $user: undefined, $userId: undefined, $timeMs: undefined }
      }
      this.channel.send(JSON.stringify(smallerAction))
    }
  }
}
