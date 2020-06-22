const crypt = require('crypto')

// mock window.getRandomValues, it doesn't exist in node
global.crypto = {
  getRandomValues: (buf) => {
    var bytes = crypt.randomBytes(buf.length)
    buf.set(bytes)
    return buf
  }
}