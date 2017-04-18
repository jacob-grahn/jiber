import * as ws from 'ws'
import {
  SET_CONNECTION,
  SET_LAST_SENT_AT,
  SET_LAST_RECEIVED_AT
} from './client-action-types'

interface IClientState {
  connection: ws,
  connectedAt: Number,
  lastSentAt: Number,
  lastReceivedAt: Number
}

export default function (state: IClientState, action: any = {}): IClientState {
  switch (action.type) {
    case undefined:
      return {
        connection: null,
        connectedAt: 0,
        lastSentAt: 0,
        lastReceivedAt: 0
      }

    case SET_CONNECTION:
      return {
        ...state,
        connection: action.connection,
        connectedAt: action.connectedAt
      }

    case SET_LAST_SENT_AT:
      return {
        ...state,
        lastSentAt: action.lastSentAt
      }

    case SET_LAST_RECEIVED_AT:
      return {
        ...state,
        lastReceivedAt: action.lastReceivedAt
      }
  }
}
