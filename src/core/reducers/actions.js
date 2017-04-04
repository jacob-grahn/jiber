import { SET_STATE } from './constants/action-types'

export const ActionCreators = {
  setState (state) {
    return {type: SET_STATE, state}
  }
}
