import { Action } from 'jiber-core'

export type Channel = {
  send: (action: Action) => void,
  onmessage?: Function
}

/**
 * Typescript doesn't seem to include RTCDataChannel by default
 * so I'm using 'any' types in a few places
 * 'pc' is short for peerConnection
 */
export const createChannel = (
  pc: RTCPeerConnection,
  isInitiator: boolean
): Channel => {
  let channel: any

  const send = (action: Action): void => {
    if (channel && channel.readyState === 'open') {
      const smallerAction = {
        ...action,
        ...{ $user: undefined, $userId: undefined, $timeMs: undefined }
      }
      channel.send(JSON.stringify(smallerAction))
    }
  }

  const self: Channel = {
    send
  }

  const setupChannel = (channel: any) => {
    channel.onmessage = (message: MessageEvent) => {
      if (self.onmessage) self.onmessage(message)
    }
  }

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

  return self
}
