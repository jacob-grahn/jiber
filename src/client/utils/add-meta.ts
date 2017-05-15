import { RoomState } from '../reducers/room/room'
import HopeAction from '../interfaces/hope-action'
import { Action, CLIENT } from '../../core/index'
import nextActionId from './next-action-id'

export default function addMeta (
  roomState: RoomState,
  action: Action
): HopeAction {
  return {
    ...action,
    $hope: {
      actionId: nextActionId(roomState.myUserId, roomState),
      roomId: action.$hope.roomId,
      source: CLIENT,
      timeMs: action.$hope.timeMs,
      userId: roomState.myUserId,
    }
  }
}
