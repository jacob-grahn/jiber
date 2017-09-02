import * as EventEmitter from 'events'
import { Action, JOIN_ROOM, CONFIRMED_STATE, Next } from '../../core/index'
import { ServerStore } from '../interfaces/server-store'
import { SEND_TO_USER } from '../../core/constants/event-types'

/**
 * When a user joins a room, send them the current state of that room
 */
export const createWelcomeNewMembers = (emitter: EventEmitter) => {
  return (store: ServerStore) => (next: Next) => (action: Action) => {
    next(action)

    if (action.type !== JOIN_ROOM) return
    if (!action.$roomId || !action.$userId) return

    const state = store.getState()
    const room = state.rooms[action.$roomId]
    if (!room) return

    const message: Action = {
      type: CONFIRMED_STATE,
      confirmed: room.confirmed,
      members: room.members,
      $roomId: action.$roomId
    }

    emitter.emit(SEND_TO_USER, action.$userId, message)
  }
}
