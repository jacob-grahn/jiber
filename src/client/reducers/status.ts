import { Action } from '../../core/index'
import { JOIN, JOIN_RESULT, LEAVE } from './room-actions'
import { JOINING, JOINED, NOT_JOINING } from './room-states'

export default function reducer (
  state: string = NOT_JOINING,
  action: Action
): string {
  switch (action.type) {
    case JOIN:
      return JOINING

    case JOIN_RESULT:
      return JOINED

    case LEAVE:
      return NOT_JOINING

    default:
      return state
  }
}
