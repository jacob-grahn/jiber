import { Action } from '../../../core/index'
import { JOIN_RESULT } from './room-actions'

export default function reducer (state: string = '', action: Action): string {
  switch(action.type) {
    case JOIN_RESULT:
      return action.myUserId

    default:
      return state
  }
}
