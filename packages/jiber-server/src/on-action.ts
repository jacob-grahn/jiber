import {
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  JOIN_ROOM
} from 'jiber-core'
import { welcomeNewMember } from './welcome-new-member'
import { ServerStore } from './server-store'
import { updateRoom } from './update-room'
import { saveRoom } from './save-room'

const webRtcActions = [WEBRTC_OFFER, WEBRTC_ANSWER, WEBRTC_CANDIDATE]

/**
 * Some actions should trigger different behaviours. This function decides!
 */
export const onAction = async (store: ServerStore, action: Action) => {
  if (webRtcActions.indexOf(action.type) !== -1) {
    store.socketServer.sendToUser(action.peerUserId, action)
  } else if (action.$roomId) {
    await updateRoom(store, action)
    if (action.type === JOIN_ROOM) {
      welcomeNewMember(store, action)
    }
    await saveRoom(store, action.$roomId)
  }
}
