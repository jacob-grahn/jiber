import * as crypto from 'crypto'

export const randStr = (len: number) => {
  const buf = crypto.randomBytes(256)
  const str = buf.toString('hex')
  return str.replace(/[W]/g, '').substr(0, len)
}
