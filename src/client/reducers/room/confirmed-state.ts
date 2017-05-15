import { Action, Reducer } from '../../../core/index'
import { JOIN_RESULT, SERVER_ACTION } from './room-actions'

export default function (subReducer: Reducer): Reducer {
  return function confirmedState (state: any = undefined, action: Action): any {
    switch(action.type) {
      case JOIN_RESULT:
        return action.confirmedState

      case SERVER_ACTION:
        return subReducer(state, action.serverAction)
    }
  }
}
