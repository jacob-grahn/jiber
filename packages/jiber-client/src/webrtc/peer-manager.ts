import {
  Action,
  Store,
  LEAVE_ROOM,
  JOIN_ROOM,
  WEBRTC_OFFER,
  forEach,
  reduce
} from 'jiber-core'
import { PeerConnection, createPeerConnection } from './peer-connection'
import { ClientSettings } from '../interfaces/client-settings'
import { ClientState } from '../interfaces/client-state'
import { prefixFix } from './prefix-fix'

const connections: {[userId: string]: PeerConnection} = {}

/**
 * When we join a room, existing members send us offers (WEBRTC_OFFER)
 * When another user joins, we send an offer (we are now an existing member)
 */
export const createPeerManager = (
  store: Store,
  settings: ClientSettings
): void => {
  // standardize browser prefixes
  prefixFix()

  // create a list of all userIds that you should be connected to
  const toAllMembers = (state: ClientState): string[] => {
    return reduce(state.rooms, (members, room) => {
      return Object.assign(members, room.members)
    }, {})
  }

  // remove a connection that we no longer want
  const remove = (userId: string): void => {
    const connection = connections[userId]
    if (!connection) return
    connection.close()
    delete connections[userId]
  }

  // remove connections we no longer want
  const removeUnusedConnections = () => {
    const allMembers = toAllMembers(store.getState())
    forEach(connections, connection => {
      if (!allMembers[connection.peerUserId]) remove(connection.peerUserId)
    })
  }

  // add a new connection
  const addConnection = (
    action: Action,
    isInitiator: boolean = false
  ): void => {
    const userId = action.$u
    if (!userId) return
    if (connections[userId]) return
    connections[userId] = createPeerConnection(
      userId,
      store,
      settings,
      isInitiator
    )
  }

  // trigger events when actions are dispatched
  store.subscribe((action: Action) => {

    // add and remove connections as needed
    if (action.$confirmed) {
      switch (action.type) {
        case LEAVE_ROOM:
          removeUnusedConnections()
          break
        case JOIN_ROOM:
          if (action.$u === store.getState().me.userId) return
          addConnection(action, true)
          break
        case WEBRTC_OFFER:
          addConnection(action)
          break
      }
    }

    // each connection responds to actions as well
    forEach(connections, connection => connection.onAction(action))
  })
}
