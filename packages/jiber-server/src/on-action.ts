import {
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  OPEN
} from 'jiber-core'
import { welcomeNewMember } from './welcome-new-member'
import { ServerStore } from './server-store'

const webRtcActions = [WEBRTC_OFFER, WEBRTC_ANSWER, WEBRTC_CANDIDATE]

/**
 * Some actions should trigger different behaviours. This function decides!
 */
export const onAction = async (store: ServerStore, action: Action) => {
  if (webRtcActions.indexOf(action.type) !== -1) {
    store.socketServer.sendToUser(action.peerUserId, action)
  } else if (action.$doc) {
    store.socketServer.sendToDoc(action.$doc, action)
    await store.dispatch(action)
    if (action.type === OPEN) {
      welcomeNewMember(store, action)
    }
  }
}
