// todo: createOffer() and createAnswer()
// todo: when to connect? who to connect to?
// todo: create middleware to pass events to webrtc
// todo: get typescript to stop complaining about createDataChannel
// todo: when to close connections?
// todo: set a maximum number of connections
// todo: I have no idea what I am doing

const pcConfig: RTCConfiguration = {iceServers: []}
const channelConfig: any = {
  ordered: false,
  negotiated: true,
  maxRetransmits: 0
}
const pc = new RTCPeerConnection(pcConfig)
const channel = pc.createDataChannel('testChannel', channelConfig)

channel.onerror = (error: any) => {
  console.log("channel.onerror", error)
}

channel.onmessage = (event: MessageEvent) => {
  console.log("channel.onmessage", event.data)
}

channel.onopen = () => {
  console.log('channel.onopen')
  channel.send("Hello World!")
}

channel.onclose = () => {
  console.log("channel.onclonse")
}
