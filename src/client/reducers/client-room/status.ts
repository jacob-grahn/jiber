import {
  Action,
  JOIN_ROOM,
  CONFIRMED_STATE,
  LEAVE_ROOM
} from '../../../core/index'

export const NOT_JOINING = 'NOT_JOINING'
export const JOINING = 'JOINING'
export const JOINED = 'JOINED'

export default function reducer (
  state: string = NOT_JOINING,
  action: Action
): string {
  switch (action.type) {
    case JOIN_ROOM:
      return JOINING

    case CONFIRMED_STATE:
      return JOINED

    case LEAVE_ROOM:
      return NOT_JOINING

    default:
      return state
  }
}
