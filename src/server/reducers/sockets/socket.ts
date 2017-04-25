import * as ws from 'ws'
import {
  SOCKET_INIT,
  SOCKET_SEND,
  SOCKET_RECEIVE
} from './socket-action-types'

interface IClientState {
  connection: ws,                                                               // WebSocket client instance
  connectedAt: number,                                                          // When the socket connected
  lastSentAt: number,                                                           // When the socket last sent a message
  lastReceivedAt: number,                                                       // When the socket last received a message
  period: number,                                                               // Current block of time that is being rate limited
  messageCount: number                                                          // Total messages received in the current block of time
}

const rateLimitPeriod = 5000                                                    // Count messages in 5 second blocks; TODO: this should be user configurable

export default function (state: IClientState, action: any = {}): IClientState {
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

    case SOCKET_INIT:
      return {
        ...state,
        connection: action.connection,
        connectedAt: action.timeMs
      }

    case SOCKET_SEND:
      return {
        ...state,
        lastSentAt: action.timeMs
      }

    case SOCKET_RECEIVE:
      const timeMs = action.timeMs
      const period = Math.floor(timeMs / rateLimitPeriod)
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
