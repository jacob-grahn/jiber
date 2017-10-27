import {
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  JOIN_ROOM
} from 'jiber-core'
import { welcomeNewMember } from './welcome-new-member'
import { ServerStore } from './server-store'

const webRtcActions = [WEBRTC_OFFER, WEBRTC_ANSWER, WEBRTC_CANDIDATE]

/**
 * Some actions should trigger different behaviours. This function decides!
 */
export const onAction = (
  store: ServerStore,
  updateRoom: (action: Action) => void,
  action: Action
) => {
  if (webRtcActions.indexOf(action.type) !== -1) {
    store.socketServer.sendToUser(action.peerUserId, action)
  } else {
    updateRoom(action)
    if (action.type === JOIN_ROOM) {
      welcomeNewMember(store, action)
    }
  }
}
