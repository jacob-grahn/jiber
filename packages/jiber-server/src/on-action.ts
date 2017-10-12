import {
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
} from 'jiber-core'
import { SendToUser } from './socket-server/send-to-user'

const webRtcActions = [WEBRTC_OFFER, WEBRTC_ANSWER, WEBRTC_CANDIDATE]

export const createOnAction = (
  updateRoom: (action: Action) => void,
  sendToUser: SendToUser
) => {
  return (action: Action) => {
    if (webRtcActions.indexOf(action.type) !== -1) {
      sendToUser(action.peerUserId, action)
    } else {
      updateRoom(action)
    }
  }
}
