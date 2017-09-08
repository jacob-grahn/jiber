/**
 * todo: is this really needed?
 */
import { Action, CLOSE_ROOM } from '../../core/index'

export const createCloseRoom = (
  dispatch: (action: Action) => void
) => {
  return ($roomId: string): void => {
    dispatch({type: CLOSE_ROOM, $roomId})
  }
}
