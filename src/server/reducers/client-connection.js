import {
  SET_CONNECTION,
  SET_LAST_SENT_AT,
  SET_LAST_RECEIVED_AT
} from './client-connection-actions'

export default function (state = {}, action = {}) {
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
