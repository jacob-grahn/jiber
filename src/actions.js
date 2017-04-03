import { SET } from './constants/action-types'

export const ActionCreators = {
  set (key, value) {
    return {type: SET, key, value}
  }
}
