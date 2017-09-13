/**
 * todo: is this really needed?
 */
import { Action, CLOSE_ROOM } from 'jiber-core'

export const createCloseRoom = (
  dispatch: (action: Action) => void
) => {
  return ($roomId: string): void => {
    dispatch({type: CLOSE_ROOM, $roomId})
  }
}
