export const determineAudience = (action: any) => {

  // actions on the root path can't be private
  if (!action.path) {
    return
  }

  // break the path up, cuz we'll need to look at it
  const bits = action.path.split('.')

  // send users.userID._private actions only to that user
  if (bits[0] === 'users' && bits.length >= 3) {
    const userBits = bits.slice(2, bits.length)
    const privateUserBits = userBits.filter((bit: string) => bit.charAt(0) === '_')
    if (privateUserBits.length > 0) {
      action.$sendOnlyTo = bits[1]
      return
    }
  }

  // send paths that are not private to every member of the doc
  const privateBits = bits.filter((bit: string) => bit.charAt(0) === '_')
  if (privateBits.length > 0) {
    action.$doNotSend = true
  }
}
