import { Action } from '../interfaces/action'
import { get } from '../swiss/get'

export const determineAudience = (state: any, action: Action) => {

  // actions on the root path can't be private
  if (!action.path) {
    return action
  }

  // break the path up, cuz we'll need to look at it
  const bits = action.path.split('.')

  // send paths that are not private to every member of the doc
  const privateBits = bits.filter((bit: string) => bit.charAt(0) === '_')
  if (privateBits.length > 0) {
    action.$doNotSend = true
  }

  // users can see their own private values
  if (action.$doNotSend) {
    let path = ''
    let userId
    for (let i = 0; i < bits.length - 1; i++) {
      if (i > 0) {
        path += '.'
      }
      path += bits[i]
      userId = get(state, `${path}.userId`)
      if (userId) {
        action.$sendOnlyTo = userId
        delete action.$doNotSend
      }
    }
  }

  return action
}
