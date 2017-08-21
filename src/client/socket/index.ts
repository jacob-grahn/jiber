import ClientStore from '../interfaces/client-store'
import ClientSettings from '../interfaces/client-settings'
import { createHopeSocket } from './hope-socket'
import { createOnMessage } from './on-message'
import { createActionHandler } from './action-handler'
import { createWebSocket } from './create-web-socket'
import { createRejoinRooms } from './rejoin-rooms'
import { createResendPending } from './resend-pending'
import { sendAction } from './send-action'
import { createTryToConnect } from './try-to-connect'
import { Action } from '../../core/index'

export const createSocket = (store: ClientStore, settings: ClientSettings) => {
  const resendPending = createResendPending(sendAction, store.getState)
  const rejoinRooms = createRejoinRooms(sendAction, store.getState)
  const actionHandler = createActionHandler(rejoinRooms, resendPending)
  const tryToConnect = createTryToConnect(createWebSocket, settings)
  const onMessage = createOnMessage(store.dispatch, actionHandler)
  const hopeSocket = createHopeSocket(tryToConnect, onMessage, sendAction)
  return hopeSocket
}

export { Action }                                                               // TS4058: make the compiler happy
