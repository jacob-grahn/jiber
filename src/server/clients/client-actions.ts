import {
  SET_CONNECTION,
  SET_LAST_SENT_AT,
  SET_LAST_RECEIVED_AT
} from './client-action-types'

export function setConnection (id, connection) {
  return {
    type: SET_CONNECTION,
    id,
    connection,
    connectedAt: new Date().getTime()
  }
}

export function setLastSentAt (id, lastSentAt) {
  return {
    type: SET_LAST_SENT_AT,
    id,
    lastSentAt
  }
}

export function setLastReceivedAt (id, lastReceivedAt) {
  return {
    type: SET_LAST_RECEIVED_AT,
    id,
    lastReceivedAt
  }
}
