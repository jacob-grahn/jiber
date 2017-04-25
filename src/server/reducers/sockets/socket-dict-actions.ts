import { SOCKET_REMOVE } from './socket-dict-action-types'
import { IAction } from '../../../core/i-action'

export function socketRemove (socketId: String): IAction {
  return { type: SOCKET_REMOVE, id: socketId }
}
