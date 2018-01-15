import { Action } from '../interfaces/action'
import { Reducer } from '../interfaces/reducer'
import { STATE } from '../constants/action-types'

/**
 * Room state
 */
export const createRoomState = (subReducer: Reducer): Reducer => {
  return (state: any = undefined, action: Action): any => {
    switch (action.type) {
      case STATE:
        return action.state

      default:
        return subReducer(state, action)
    }
  }
}
