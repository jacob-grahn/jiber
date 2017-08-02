import { Action, CLOSE_ROOM } from '../../core/index'

export default function createCloseRoom (
  dispatch: (action: Action) => void
) {
  return function closeRoom ($roomId: string): void {
    dispatch({type: CLOSE_ROOM, $roomId})
  }
}
