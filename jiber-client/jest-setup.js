const crypt = require('crypto')
const { RTCPeerConnection } = require('wrtc')

// mock window.getRandomValues, it doesn't exist in node
global.crypto = {
  getRandomValues: (buf) => {
    var bytes = crypt.randomBytes(buf.length)
    buf.set(bytes)
    return buf
  }
}

// add peer connections to node
global.RTCPeerConnection = RTCPeerConnection
