import { Action } from 'jiber-core'

export const createChannel = (initChannel: any) => {
  const channel = initChannel || createChannel()
  return {
    send: (action: Action) => void
  }
}

const send = (action: Action): void => {
  if (channel && channel.readyState === 'OPEN') {
    channel.send(JSON.stringify(action))
  }
}

// typescript doesn't know RTCDataChannel
const setupChannel = (channel: any) => {
  channel.onerror = (error: any) => {
    console.log('channel.onerror', error)
  }

  channel.onmessage = (event: MessageEvent) => {
    console.log('channel.onmessage', event.data)
  }

  channel.onopen = () => {
    channel.send('Hello World!')
  }

  channel.onclose = () => {
    console.log('channel.onclonse')
  }
}

const createChannel = (pc: RTCPeerConnection) => {
  const channelConfig = {ordered: false, maxRetransmits: 0}
  const channel = (pc as any).createDataChannel('data', channelConfig)
  setupChannel(channel)
}
