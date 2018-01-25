import {
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  OPEN,
  SERVER
} from 'jiber-core'
import { welcomeNewMember } from './welcome-new-member'
import { ServerStore } from './server-store'

const webRtcActions = [WEBRTC_OFFER, WEBRTC_ANSWER, WEBRTC_CANDIDATE]

/**
 * Some actions should trigger different behaviours. This function decides!
 * @todo: should this be middleware?
 */
export const onAction = (store: ServerStore, action: Action) => {
  action.$src = SERVER

  if (webRtcActions.indexOf(action.type) !== -1) {
    store.socketServer.sendToUser(action.peerUserId, action)
  } else if (action.$doc) {
    store.dispatch(action)
    store.socketServer.sendToDoc(action.$doc, action)
  }

  if (action.type === OPEN) {
    welcomeNewMember(store, action)
  }
}
