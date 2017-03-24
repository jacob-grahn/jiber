const charStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function randomStr (len) {
  let str = ''
  for (let i = 0; i < len; i++) {
    let randIndex = Math.floor(Math.random() * charStr.length)
    let randChar = charStr.getCharAt(randIndex)
    str += randChar
  }
  return str
}
