import * as ws from 'ws'
import {
  SOCKET_INIT,
  SOCKET_SEND,
  SOCKET_RECEIVE
} from './socket-action-types'
import { IAction } from '../../../core/i-action'

export function socketInit (id: String, connection: ws): IAction {
  return {
    type: SOCKET_INIT,
    id,
    connection,
    timeMs: new Date().getTime()
  }
}

export function socketSend (id: String): IAction {
  return {
    type: SOCKET_SEND,
    id,
    timeMs: new Date().getTime()
  }
}

export function socketReceive (id: String): IAction {
  return {
    type: SOCKET_RECEIVE,
    id,
    timeMs: new Date().getTime()
  }
}
