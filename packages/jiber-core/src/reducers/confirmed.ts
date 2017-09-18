import { Action } from '../interfaces/action'
import { Reducer } from '../interfaces/reducer'
import { CONFIRMED_STATE } from '../constants/action-types'
import { SERVER } from '../constants/source-types'

/**
 * State that has been confirmed by the SERVER
 */
export const createConfirmed = (subReducer: Reducer): Reducer => {
  return (state: any = undefined, action: Action): any => {
    switch (action.type) {

      case CONFIRMED_STATE:
        return action.confirmed

      default:
        if (action.$source === SERVER) {
          return subReducer(state, action)
        } else {
          return state
        }
    }
  }
}
