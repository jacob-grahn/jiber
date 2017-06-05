import { Action, JOIN, CONFIRMED_STATE, LEAVE } from '../../../core/index'

export const NOT_JOINING = 'NOT_JOINING'
export const JOINING = 'JOINING'
export const JOINED = 'JOINED'

export default function reducer (
  state: string = NOT_JOINING,
  action: Action
): string {
  switch (action.type) {
    case JOIN:
      return JOINING

    case CONFIRMED_STATE:
      return JOINED

    case LEAVE:
      return NOT_JOINING

    default:
      return state
  }
}
