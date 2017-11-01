import { Action } from 'jiber-core'

export type PeerChannel = {
  send: (action: Action) => void
}

/**
 * Typescript doesn't seem to include RTCDataChannel by default
 * so I'm using 'any' types in a few places
 * 'pc' is short for peerConnection
 */
export const createChannel = (
  pc: RTCPeerConnection,
  isInitiator: boolean,
  receiver: (event: MessageEvent) => void
): PeerChannel => {
  let channel: any

  const send = (action: Action): void => {
    if (channel && channel.readyState === 'open') {
      const smallerAction = {
        ...action,
        ...{ $user: undefined, $u: undefined, $t: undefined }
      }
      channel.send(JSON.stringify(smallerAction))
    }
  }

  const setupChannel = (channel: any) => {
    channel.onmessage = receiver
  }

  const createOrWait = () => {
    if (isInitiator) {
      const channelConfig = { ordered: false, maxRetransmits: 0 }
      channel = (pc as any).createDataChannel('data', channelConfig)
      setupChannel(channel)
    } else {
      (pc as any).ondatachannel = (event: any) => {
        channel = event.channel
        setupChannel(channel)
      }
    }
  }

  createOrWait()

  return {
    send
  }
}
