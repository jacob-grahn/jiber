import * as ws from 'ws'
import store from '../store'
import { Action } from '../../core/index'

// Actions
const INIT = 'hope/socket/INIT'
const SEND = 'hope/socket/SEND'
const RECEIVE = 'hope/socket/RECEIVE'
const LOGIN = 'hope/socket/LOGIN'
const REMOVE = 'hope/socket/REMOVE'

// Reducer
interface ClientState {
  connection: ws,                                                               // WebSocket client instance
  connectedAt: number,                                                          // When the socket connected
  lastSentAt: number,                                                           // When the socket last sent a message
  lastReceivedAt: number,                                                       // When the socket last received a message
  period: number,                                                               // Current block of time that is being rate limited
  messageCount: number                                                          // Total messages received in the current block of time
}

export default function reducer (
  state: ClientState,
  action: any = {}
): ClientState {
  switch (action.type) {
    case undefined:
      return {
        connection: null,
        connectedAt: 0,
        lastSentAt: 0,
        lastReceivedAt: 0,
        period: 0,
        messageCount: 0
      }

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
      const period = Math.floor(timeMs / store.state.options.rateLimit.periodMs)
      const isSamePeriod = (period === state.period)
      const messageCount = isSamePeriod ? (state.messageCount + 1) : 1
      return {
        ...state,
        period,
        messageCount,
        lastReceivedAt: timeMs
      }
  }
}

// Action Creators
export function socketInit (id: string, connection: ws): Action {
  return {type: INIT, id, connection, timeMs: new Date().getTime()}
}

export function socketSend (id: string): Action {
  return {type: SEND, id, timeMs: new Date().getTime()}
}

export function socketReceive (id: string): Action {
  return {type: RECEIVE, id, timeMs: new Date().getTime()}
}

export function socketRemove (id: string): Action {
  return {type: REMOVE, id}
}
