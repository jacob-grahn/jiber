import * as ws from 'ws'
import {
  SET_CONNECTION,
  SET_LAST_SENT_AT,
  SET_LAST_RECEIVED_AT
} from './client-action-types'

export function setConnection (id: String, connection: ws) {
  return {
    type: SET_CONNECTION,
    id,
    connection,
    connectedAt: new Date().getTime()
  }
}

export function setLastSentAt (id: String, lastSentAt: Number) {
  return {
    type: SET_LAST_SENT_AT,
    id,
    lastSentAt
  }
}

export function setLastReceivedAt (id: String, lastReceivedAt: Number) {
  return {
    type: SET_LAST_RECEIVED_AT,
    id,
    lastReceivedAt
  }
}
