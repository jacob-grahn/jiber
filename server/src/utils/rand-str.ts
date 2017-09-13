import * as crypto from 'crypto'

export const randStr = (len: number) => {
  const buf = crypto.randomBytes(Math.ceil(len / 2))
  const str = buf.toString('hex')
  return str.substr(0, len)
}
