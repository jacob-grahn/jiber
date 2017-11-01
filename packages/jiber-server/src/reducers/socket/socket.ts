import { Action, ADD_USER, INIT_SOCKET, REMOVE_SOCKET } from 'jiber-core'
import * as ws from 'ws'

export type Socket = { ws?: ws, userId?: string } | undefined

/**
 * Holds useful info for managing our socket connections
 */
export const socket = (state: Socket = {}, action: Action): Socket => {
  switch (action.type) {
    case INIT_SOCKET:
      return { ...state, ws: action.ws }
    case ADD_USER:
      return { ...state, userId: action.userId }
    case REMOVE_SOCKET:
      return undefined
    default:
      return state
  }
}
