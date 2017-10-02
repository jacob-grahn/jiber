// todo: createOffer() and createAnswer()
// todo: when to connect? who to connect to?
// todo: create middleware to pass events to webrtc
// todo: get typescript to stop complaining about createDataChannel
// todo: when to close connections?
// todo: set a maximum number of connections
// todo: I have no idea what I am doing
// https://shanetully.com/2014/09/a-dead-simple-webrtc-example/
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling

// standardize browser prefixes
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

// todo: remove these public stun servers and supply them via config
const pcConfig: RTCConfiguration = {
  iceServers: [
    {urls: 'stun:stun3.l.google.com:19302'},
    {urls: 'stun:stunserver.org'}
  ]
}
const channelConfig: any = {
  ordered: false,
  negotiated: true,
  maxRetransmits: 0
}

const pc = new RTCPeerConnection(pcConfig)
const channel = pc.createDataChannel('testChannel', channelConfig)

pc.createOffer()
.then((offer: RTCSessionDescriptionInit) => {
  pc.setLocalDescription(offer)
  sendOffer(offer)
})

const receiveIceCandidate = (candidate) => {
  pc.addIceCandidate(new RTCIceCandidate(candidate))
}

pc.onicecandidate = (candidate) => {
  console.log('onicecandidate', candidate)
  if (!candidate) return
  sendIceCandidate(candidate)
}

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
