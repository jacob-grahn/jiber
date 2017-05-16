import { RoomState } from '../reducers/room/room'
import HopeAction from '../interfaces/hope-action'
import { Action, CLIENT } from '../../core/index'
import nextActionId from './next-action-id'

export default function addMeta (
  roomState: RoomState,
  action: Action
): HopeAction {
  const meta = action.$hope
  const roomId = (typeof meta === 'string') ? meta : meta.roomId
  return {
    ...action,
    $hope: {
      actionId: nextActionId(roomState.myUserId, roomState),
      roomId,
      source: CLIENT,
      timeMs: action.$hope.timeMs || 0,
      userId: roomState.myUserId,
    }
  }
}
