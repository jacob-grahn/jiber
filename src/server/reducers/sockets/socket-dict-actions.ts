import { SOCKET_REMOVE } from './socket-dict-action-types'
import { Action } from '../../../core/index'

export function socketRemove (socketId: String): Action {
  return { type: SOCKET_REMOVE, id: socketId }
}
