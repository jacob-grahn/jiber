import {
  Action,
  Store,
  LEAVE_ROOM,
  JOIN_ROOM,
  WEBRTC_OFFER,
  forEach,
  reduce
} from 'jiber-core'
import { Peer, createPeer } from './peer'
import { ClientSettings } from '../interfaces/client-settings'
import { ClientState } from '../interfaces/client-state'
import { prefixFix } from './prefix-fix'

/**
 * When we join a room, existing members send us offers (WEBRTC_OFFER)
 * When another user joins, we send an offer (we are now an existing member)
 */
export const createPeerManager = (store: Store, settings: ClientSettings): void => {
  // standardize browser prefixes
  prefixFix()

  //
  const connections: {[userId: string]: Peer} = {}

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
  const addConnection = (userId: string, offer?: any): void => {
    if (connections[userId]) return
    if (Object.keys(connections).length >= settings.maxPeers) return
    connections[userId] = createPeer(
      userId,
      store,
      settings,
      offer
    )
  }

  // add and remove connections as needed
  store.subscribe((action: Action) => {
    if (!action.$confirmed) return

    switch (action.type) {
      case LEAVE_ROOM:
        return removeUnusedConnections()
      case JOIN_ROOM:
        if (!action.$u) return
        if (action.$u === store.getState().me.userId) return
        return addConnection(action.$u)
      case WEBRTC_OFFER:
        if (!action.$u) return
        return addConnection(action.$u, action.offer)
    }
  })
}
