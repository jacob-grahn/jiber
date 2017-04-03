import { SET } from '../constants/action-types'

export default function simpleSetter () {
  return (state = {}, action = {}) => {
    switch (action.type) {
      case undefined:
        return state

      case SET:
        state[action.key] = action.value
    }
  }
}
