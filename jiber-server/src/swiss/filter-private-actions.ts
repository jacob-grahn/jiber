export const sendLogicActions = (actions: any[], sendToMembers: any, sendToMember: any) => {
  actions.forEach(action => {

    // actions on the root path can't be private
    if (!action.path) {
      return sendToMembers(action)
    }

    // break the path up, cuz we'll need to look at it
    const bits = action.path.split('.')

    // send users.userID._private actions only to that user
    if (bits[0] === 'users' && bits.length >= 3) {
      const userBits = bits.slice(2, bits.length - 1)
      const privateUserBits = userBits.filter((bit: string) => bit.charAt(0) === '_')
      if (privateUserBits.length > 0) {
        return sendToMember(bits[1], action)
      }
    }

    // send paths that are not private to every member of the doc
    const privateBits = bits.filter((bit: string) => bit.charAt(0) === '_')
    if (privateBits.length === 0) {
      return sendToMembers(action)
    }
  })
}
