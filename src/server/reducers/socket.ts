import { Action, ADD_USER } from '../../core/index'
import { Socket } from '../interfaces/socket'

// Setup
export interface ClientState {
  connection?: Socket,                                                          // WebSocket client instance
  connectedAt: number,                                                          // When the socket connected
  lastSentAt: number,                                                           // When the socket last sent a message
  lastReceivedAt: number,                                                       // When the socket last received a message
  period: number,                                                               // Current block of time that is being rate limited
  messageCount: number                                                          // Total messages received in the current block of time
  userId: string                                                                // account logged in on this socket
}

const defaultClientState = {
  connection: undefined,
  connectedAt: 0,
  lastSentAt: 0,
  lastReceivedAt: 0,
  period: 0,
  messageCount: 0,
  userId: ''
}

// Actions
const INIT = 'hope/socket/INIT'
const SEND = 'hope/socket/SEND'
const RECEIVE = 'hope/socket/RECEIVE'
const REMOVE = 'hope/socket/REMOVE'

// Reducer
export default function socket (
  state: ClientState = defaultClientState,
  action: Action
): ClientState {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        connection: action.connection,
        connectedAt: action.timeMs
      }

    case SEND:
      return {
        ...state,
        lastSentAt: action.timeMs
      }

    case RECEIVE:
      const timeMs = action.timeMs
      const period = action.period
      const isSamePeriod = (period === state.period)
      const messageCount = isSamePeriod ? (state.messageCount + 1) : 1
      return {
        ...state,
        period,
        messageCount,
        lastReceivedAt: timeMs
      }

    case ADD_USER:
      return {...state, userId: action.userId}

    default:
      return state
  }
}

// Action Creators
export function socketInit (socketId: string, connection: Socket): Action {
  return {type: INIT, socketId, connection, timeMs: new Date().getTime()}
}

export function socketSend (socketId: string): Action {
  return {type: SEND, socketId, timeMs: new Date().getTime()}
}

export function socketReceive (socketId: string): Action {
  const timeMs = new Date().getTime()
  return {type: RECEIVE, socketId, timeMs, period: Math.floor(timeMs / 10000)}
}

export function socketRemove (socketId: string): Action {
  return {type: REMOVE, socketId}
}
